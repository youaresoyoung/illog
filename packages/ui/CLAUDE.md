# `@illog/ui` — Component Conventions for AI Agents

When you write or modify a component in `packages/ui`, follow this file exactly. These conventions exist because `@illog/ui` is the single source of truth for illog's design system, consumed by `services/app`, `services/web`, `services/storybook`, and (soon) Figma.

## Folder layout (one component = one folder)

Every component lives at `src/components/<ComponentName>/` with this layout:

```
src/components/Button/
├── index.ts          # re-export the public API only
├── Button.tsx        # implementation
├── button.css.ts     # vanilla-extract styles (lowercase first letter)
├── types.ts          # exported prop types (optional but preferred)
└── Button.test.tsx   # vitest + @testing-library/react
```

For **compound components** (multi-part APIs like `<Selector>`), use nested folders:

```
src/components/Selector/
├── index.ts                     # re-export TagSelector, BadgeSelector, BasicSelector
├── selector.css.ts              # shared styles
├── editor.css.ts                # shared sub-part styles
├── BadgeSelector/
│   ├── index.ts
│   ├── BadgeSelector.tsx
│   └── ...
├── BasicSelector/
└── TagSelector/
```

A compound component exposes its context hook as `use<Name>Context` (see `useTagSelectorContext`, `useBadgeSelectorContext`, `useBasicSelectorContext`, `useContextMenuContext`).

## Required: register in the package barrel

After creating a component, add an export to `packages/ui/src/index.ts`. The barrel is the **only** public surface. App code does `import { Button } from '@illog/ui'` — never deep-imports.

If the component has exported types (variants, items), export those as `export type { ... }` in the same file.

## Styling rules

1. **Use `@vanilla-extract/sprinkles`** for one-off layout/spacing/color via the `sprinkles({...})` helper from `src/core/sprinkles.css`. All sprinkles values resolve to `@illog/themes` tokens.
2. **Use `@vanilla-extract/recipes`** (`recipe({...})`) for variant-based styling. Pattern in `Button/button.css.ts` is canonical.
3. **Never hardcode colors, spacing, radius, font sizes, font weights.** Always reference tokens. If a token you need does not exist, propose adding it to `packages/themes/src/tokens/` rather than hardcoding.
4. **No inline `style={{}}`** except for purely dynamic, runtime-only values (e.g., `style={{ height: \`${dynamicPx}px\` }}`where the value is computed at render). Even then, prefer`assignInlineVars`from`@vanilla-extract/dynamic`.
5. **Class composition** uses `clsx` (already a devDep). Pattern: `clsx([recipe({...}), className])`.

## Props pattern

- Define a `<ComponentName>Props` type in `types.ts` (or at the top of the `.tsx` if trivial).
- Extend the matching DOM element type when the component wraps an HTML element: `& ButtonHTMLAttributes<HTMLButtonElement>`.
- Use string union literals for variants: `variant: 'primary' | 'secondary'`. Never enums.
- Prefix booleans with `is` or `has`: `isDisabled`, `isFullWidth`, `hasError`. Not `disabled`, not `fullWidth`.
- Accept `ref?: Ref<HTMLXxxElement>` directly in props (React 19 — no `forwardRef` needed).
- Accept `className?: string` and merge with internal classes via `clsx`.
- Spread `...rest` onto the root element after your own attributes so consumers can override.

## Tokens — what exists, what to use

Tokens live in `packages/themes/src/tokens/` and are exposed via:

- **CSS variables** (e.g., `var(--background-default-default)`, `var(--text-color-default)`) — preferred for runtime theming
- **Generated TS objects** in `src/core/tokens/generatedColors.ts` — auto-generated, do not edit
- **Sprinkles** — the ergonomic API; reference token names as string keys

Categories:

- **colors**: 3 themes (`light`, `dark`, `primitive`). Semantic naming: `background-default-default`, `text-color-default`, `border-color-subtle`, etc.
- **size**: `space` (8px grid + half-steps), `icon`, `radius`, `stroke`, `blur`, `depth`
- **typography**: font family (Inter), scale, weight presets
- **responsive**: breakpoints

Never add raw values to `*.css.ts`. Always import from `@illog/themes` or use sprinkles.

## Testing rules

- Co-locate tests as `<Name>.test.tsx`.
- Use `@testing-library/react` queries (`getByRole`, `getByText`); avoid `getByTestId` unless DOM has no semantic anchor.
- Test the public API (props in, behavior out). Do not test sprinkles class names.
- For interactive components, prefer `@testing-library/user-event` over `fireEvent`.

## Compound component pattern

Use React context, expose `use<Name>Context` hook for advanced consumers.

```tsx
// Pattern (simplified):
const SelectorContext = createContext<SelectorContextValue | null>(null)

export const useTagSelectorContext = () => {
  const ctx = useContext(SelectorContext)
  if (!ctx) throw new Error('useTagSelectorContext must be used inside <TagSelector>')
  return ctx
}

export const TagSelector = (props) => {
  /* renders provider + parts */
}
```

Sub-parts can be exposed as static properties (`TagSelector.Item`) or as separately-exported components — match what existing components do.

## Auto-generated artifacts (do not hand-edit)

- `src/core/tokens/generatedColors.ts` — regen via `pnpm build:color`
- `src/assets/icons/*` — regen via `pnpm build:icons`
- `components.spec.json` — regen via `pnpm gen:spec`

## Storybook

Stories live in `services/storybook/stories/UI/<Component>/`. When you add a new component, add at least one story showing the canonical usage. Use the same prop names as the component's exported types.

## Figma Code Connect (future)

When Code Connect is wired up, each component will have a `<Component>.figma.tsx` co-located with the implementation. AI agents should not invent these files until the Code Connect setup PR lands.

## Quick checklist before committing a UI change

- [ ] Component folder follows the layout above
- [ ] No raw color/spacing/radius/font values
- [ ] Boolean props prefixed with `is`/`has`
- [ ] Variant props are string union literals
- [ ] Exported from `packages/ui/src/index.ts`
- [ ] Test file exists, tests behavior not styles
- [ ] `pnpm --filter @illog/ui typecheck` passes
- [ ] `pnpm --filter @illog/ui test` passes
- [ ] If a new token was added: `pnpm --filter @illog/ui build:color` ran and `generatedColors.ts` updated
