# Building a Design System in the shadcn Era — And What I'd Do Differently

> **발표자 사용 가이드**
>
> - **슬라이드 본문**: 영문 (실제 슬라이드에 들어갈 텍스트 그대로)
> - **스피커 스크립트**: 한국어 리허설용 (실제 발표 시 영문 변환 필요)
> - **타이밍**: 총 22분 + Q&A 5분
> - **데모 백업**: 라이브 코드는 위험 → 캡처 + 짧은 GIF 권장
> - **모든 코드 인용은 illog 프로젝트의 실제 코드**에서 발췌됨

---

## Meta

| 항목            | 값                                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------- |
| **대상**        | Senior engineers (hiring decision-makers)                                                                         |
| **분량**        | 22 min talk + 5 min Q&A                                                                                           |
| **슬라이드 수** | 19                                                                                                                |
| **데모**        | 1개 (라이브 X, 캡처 O)                                                                                            |
| **핵심 메시지** | "I make trade-off-driven decisions, not framework-driven ones — and I extend the same mindset to AI-era tooling." |

---

## Slide 1 — Title

**On-slide:**

```
Building a Design System
in the shadcn Era

— And What I'd Do Differently

[Your Name] · 2026
```

**Speaker script (1 min):**

> 안녕하세요, [이름]입니다.
>
> 오늘 발표 제목은 "shadcn 시대에 디자인 시스템을 직접 만든다는 것, 그리고 다시 한다면 바꿀 것들"입니다.
>
> 2026년에 디자인 시스템을 직접 만든다는 건 좀 의심스럽게 들릴 수 있습니다. shadcn/ui, Radix, Tailwind v4가 이미 다 풀어놓은 문제처럼 보이거든요. 그런데 제가 1년 동안 개인 프로젝트에 쓸 디자인 시스템을 직접 설계하면서, 시니어 분들이 평소 고민하실 만한 결정 몇 가지를 직접 부딪혀봤습니다.
>
> 오늘은 그 과정에서 **잘한 결정 세 개**, 그리고 **다시는 안 할 결정 두 개**를 솔직하게 공유하려고 합니다.

---

## Slide 2 — Today's Question

**On-slide:**

```
"Why would anyone build a design system from scratch in 2026?"

Three honest answers:

1. To learn what frameworks abstract away
2. To make decisions, not consume them
3. Because my constraints didn't fit the defaults
```

**Speaker script (1 min):**

> 발표 전에 한 가지 질문을 던지고 싶습니다. "2026년에 누가 디자인 시스템을 처음부터 만드냐"는 질문이요.
>
> 솔직히 답하면 세 가지입니다.
> 첫째, **프레임워크가 가려둔 결정들을 직접 해보고 싶었습니다**.
> 둘째, **소비자가 아니라 결정자가 되어보고 싶었습니다**.
> 셋째, **제 제약 조건이 기본값에 맞지 않았습니다** — 이 부분이 오늘의 핵심입니다.

---

## Slide 3 — Context: What I'm Working With

**On-slide:**

```
illog — Personal Electron app

Stack:
- pnpm monorepo + Nx
- Electron Forge + Vite
- React 19 + react-router 7
- Vanilla-extract (zero-runtime CSS-in-TS)

Constraint: Bundle size matters (Electron ships every byte)
Scope: 1 user (me). 28 components. 1 year.
```

**Speaker script (1 min):**

> 컨텍스트부터 먼저 말씀드릴게요.
>
> illog는 제 개인 Electron 데스크탑 앱입니다. **사용자는 저 한 명**이에요. 이걸 먼저 솔직하게 말씀드리는 이유는, 오늘 제가 "회사 규모의 DS"에 대한 답을 가져온 게 아니라는 점을 분명히 하고 싶어서입니다.
>
> 다만 Electron이라는 환경 때문에 **번들 사이즈가 진짜 민감**했고, 이 제약이 제 모든 결정을 끌고 갔습니다. 웹 SaaS와는 다른 공간이죠.
>
> 1년 동안 28개 컴포넌트를 만들었고, pnpm 모노레포에 두 패키지로 나눠 운영했습니다.

---

## Slide 4 — The 2026 DS Landscape

**On-slide:**

```
What I considered first (and didn't pick):

┌─────────────────────────────────────────────────┐
│ shadcn/ui    →  Tailwind required               │
│ MUI / Chakra →  Runtime CSS-in-JS cost          │
│ Radix only   →  No styling story                │
│ Tailwind v4  →  Atomic, but no token contract   │
└─────────────────────────────────────────────────┘

What I picked: Vanilla-extract + custom token layer
```

**Speaker script (1.5 min):**

> 2026년 디자인 시스템 생태계는 사실 풍부합니다. 제가 진지하게 검토한 옵션들을 보여드릴게요.
>
> **shadcn/ui**는 훌륭하지만 Tailwind를 강제합니다. 저는 Tailwind의 클래스 폭발이 Electron 번들에서 부담스러웠어요.
>
> **MUI나 Chakra**는 API 디자인이 정말 좋은데, 런타임 CSS-in-JS 비용이 있습니다. 매 렌더마다 스타일 객체를 생성해서 주입하죠.
>
> **Radix**만 쓰면 스타일링은 처음부터 다시 풀어야 합니다.
>
> **Tailwind v4**는 강력하지만, 디자인 토큰을 타입 레벨에서 강제할 방법이 없어요.
>
> 그래서 저는 **Vanilla-extract** 위에 직접 토큰 레이어를 올리는 길을 택했습니다.

---

## Slide 5 — Why Not shadcn/ui? (3 reasons specific to my case)

**On-slide:**

```
1. Tailwind dependency chain
   → Conflicts with vanilla-extract zero-runtime goal

2. Theme = light/dark only
   → I needed brand-level theming primitives

3. Static class API
   → No type-safe style props (e.g., <Box p="200">)
```

**Speaker script (1.5 min):**

> shadcn/ui를 안 쓴 이유를 더 구체적으로 말씀드릴게요. 시니어 분들이 가장 먼저 던지실 질문이거든요.
>
> **첫째**, shadcn은 Tailwind 의존성을 끌고 옵니다. 제로 런타임 CSS를 추구하는 vanilla-extract 결정과 충돌해요.
>
> **둘째**, shadcn의 테마 시스템은 light/dark에 최적화되어 있는데, 저는 처음부터 **primitive 토큰 → 의미 토큰 → 컴포넌트** 3단 계층을 만들고 싶었습니다.
>
> **셋째**, 가장 중요한 건데요, shadcn의 className 패턴은 `<Box p="200">` 같은 **타입 안전한 style props**를 만들기가 어렵습니다. 저는 Chakra의 DX를 빌드 타임에 옮기고 싶었어요.
>
> 정리하면 — shadcn은 "잘못된 도구"가 아니라 "제 제약에 안 맞는 도구"였습니다.

---

## Slide 6 — Architecture: Two Packages

**On-slide:**

```
packages/
├── themes/          ← Design tokens (no React)
│   └── src/
│       ├── tokens/        colors, size, typography, responsive
│       ├── styles/        composed effects, text styles
│       └── utils/         flattenTokens, color-utils
│
└── ui/              ← React components (consumes themes)
    └── src/
        ├── core/          sprinkles, styleProps, interaction
        ├── components/    28 components (Box → Typography)
        └── hooks/

Why split: themes is React-free → reusable in any renderer
```

**Speaker script (1.5 min):**

> 아키텍처는 의도적으로 단순하게 두 패키지로 나눴습니다.
>
> [`packages/themes`](packages/themes)는 **순수 디자인 토큰**입니다. React가 전혀 없어요. 색상, 사이즈, 타이포그래피, 반응형 정의가 들어있고요.
>
> [`packages/ui`](packages/ui)는 React 컴포넌트입니다. themes를 소비하죠.
>
> 왜 이렇게 나눴느냐 — themes를 React에 묶지 않으면, 나중에 만약 mobile native나 다른 렌더러에서도 같은 토큰을 쓸 수 있어요. **결합도를 일부러 낮춘** 결정입니다. 지금은 활용 안 하지만, 미래의 옵션을 열어두는 거죠.

---

## Slide 7 — Token Layer 1: Color (primitive → semantic)

**On-slide:**

```
packages/themes/src/tokens/colors/
├── primitive.ts    raw scale (blue.100 ~ blue.900)
├── light.ts        semantic mapping (surface.default → blue.50)
└── dark.ts         semantic mapping (surface.default → blue.900)

Component code never references primitive.
Components reference semantic tokens only.

→ Theme switching = swap mapping, not rewrite components
```

**Speaker script (1.5 min):**

> 컬러는 두 단계로 분리했습니다.
>
> **primitive 레이어**는 순수 색상 스케일이에요 — `blue.100`, `gray.900` 같은 raw 값.
>
> **semantic 레이어**가 그 위에서 의미를 부여합니다 — `surface.default`, `text.primary` 같은 거요. 라이트 테마에서는 `surface.default`가 `blue.50`을 가리키고, 다크 테마에서는 `blue.900`을 가리키는 식이죠.
>
> **컴포넌트 코드는 절대 primitive를 직접 참조하지 않습니다.** 항상 semantic 토큰만 봐요. 이렇게 하면 테마를 바꿀 때 매핑만 갈아끼우면 되고, 컴포넌트는 한 줄도 안 건드려요.
>
> 이건 사실 Material Design Tokens M3가 정의한 패턴인데, 직접 구현해보니 **왜 이게 표준이 됐는지 몸으로 이해**됐습니다.

---

## Slide 8 — Token Layer 2: Size (6 separate concerns)

**On-slide:**

```
packages/themes/src/tokens/size/
├── space.ts     spacing scale (4, 8, 12, 16, 24, 32...)
├── radius.ts    border-radius scale
├── stroke.ts    border-width scale
├── icon.ts      icon size scale
├── blur.ts      backdrop-filter blur scale
└── depth.ts     z-index scale

Why split: each scale has its own rhythm
A "spacing" token shouldn't be reused as "border radius"
```

**Speaker script (1.5 min):**

> 사이즈 토큰은 6개로 쪼갰습니다. 처음에는 저도 "그냥 spacing 하나면 되지 않나?" 했는데요.
>
> 막상 컴포넌트를 만들어보니 **각 스케일은 고유한 리듬**이 있다는 걸 발견했습니다. 패딩 8px은 자연스럽지만 border-radius 8px은 너무 둥글 수 있어요. icon 16px과 spacing 16px은 의미가 완전히 다르고요.
>
> 그래서 `space`, `radius`, `stroke`, `icon`, `blur`, `depth`를 다 분리했습니다. 약간 과해 보일 수 있지만, **의미가 다른 값을 같은 변수로 공유하면 결국 어느 한쪽이 깨집니다.** Tailwind의 `p-2`/`rounded-2`가 같은 스케일을 공유해서 생기는 문제를 제가 직접 겪었거든요.

---

## Slide 9 — Token Layer 3: Typography (2-stage composition)

**On-slide:**

```
packages/themes/src/tokens/typography/
├── primitive.ts    font-family, font-weight, font-size, line-height (raw)
└── typography.ts   composed text styles (heading.lg, body.md, caption.sm)

Component receives composed only:
  <Typography variant="heading.lg" />

Not allowed:
  <Typography fontSize="24" weight="bold" />   ← bypasses contract
```

**Speaker script (1.5 min):**

> 타이포그래피도 같은 패턴입니다. **primitive**는 font-family, font-weight, font-size, line-height 같은 raw 값들이고요. **composed**는 그 조합에 의미를 부여한 것 — `heading.lg`, `body.md` 같은 거요.
>
> 컴포넌트는 composed만 받게 했습니다. **fontSize와 weight를 따로 받는 props는 일부러 안 만들었어요.** 왜냐면 그 순간 디자인 시스템의 계약이 깨지거든요. 모두가 "이번 한 번만"이라며 우회하기 시작합니다.
>
> 이게 디자인 시스템의 **가장 중요한 룰** 중 하나라고 생각합니다 — **편의성보다 일관성을 우선**한다.

---

## Slide 10 — Codegen Pipeline (the part I'm proudest of)

**On-slide:**

```
themes/scripts/build-css-themes.ts
  TS tokens   →   themes.css (CSS custom properties)

ui/scripts/generate-color-objects.ts
  themes.css  →   src/core/tokens/generatedColors.ts
                  (typed TS objects: backgroundColors, textColors, borderColors)

ui/scripts/generate-icons.ts
  src/assets/svg/*.svg  →   typed icon components

→ Designer changes a token → types update → IDE autocomplete updates
→ Add an SVG → typed component appears

(Slide 15 extends this same pipeline to feed AI agents and Figma.)
```

**Speaker script (2 min):**

> 자랑하고 싶은 결정 첫 번째입니다 — **codegen 파이프라인**.
>
> 디자인 토큰은 TS로 정의하지만, 그게 곧바로 CSS variables로 빌드됩니다 — `--color-surface-default: ...` 이런 식으로요.
>
> 그 다음에 [`generate-color-objects.ts`](packages/ui/scripts/generate-color-objects.ts)가 **그 CSS를 다시 파싱해서** 타입이 붙은 TS 객체로 만들어냅니다. `backgroundColors`, `textColors`, `borderColors`로 그룹화해서요.
>
> 왜 이렇게 했냐 — sprinkles에 색을 정의할 때 **CSS variable 참조를 직접 쓰면서도 IDE 자동완성을 받을 수 있게** 하려고요. 하나의 source of truth(토큰)에서 양방향(CSS + TS)으로 뻗어나가는 구조입니다.
>
> SVG 아이콘도 비슷합니다. `src/assets/svg/`에 SVG를 넣으면 자동으로 타입이 붙은 React 컴포넌트가 생성됩니다.
>
> 이 mindset이 나중에 **AI 에이전트와 Figma까지 확장**됩니다 — 슬라이드 15에서 이어갈게요.

---

## Slide 11 — Style API #1: Sprinkles (build-time)

**On-slide:**

```ts
// From packages/ui/src/core/sprinkles.css.ts

const spacingProperties = defineProperties({
  properties: {
    margin: space, padding: space, gap: space, /* ... */
  },
  shorthands: {
    p: ['padding'],   px: ['paddingLeft', 'paddingRight'],
    m: ['margin'],    mx: ['marginLeft', 'marginRight'],
    bg: ['backgroundColor'],
    rounded: ['borderRadius'],
    w: ['width'],     h: ['height'],
  }
})

// Usage:
<Box p="200" bg="surface.default" rounded="md">
```

```
✓ Atomic CSS classes generated at build time
✓ Zero runtime cost
✗ Only finite, predefined values
```

**Speaker script (2 min):**

> 스타일 API 첫 번째 — **Sprinkles**입니다. Vanilla-extract의 sprinkles는 빌드 타임에 atomic CSS 클래스를 생성합니다.
>
> 보시는 코드처럼 padding, margin, color, border-radius 같은 **고정된 토큰 값**을 다 sprinkles에 정의했습니다. Chakra 스타일의 단축어도 다 넣었어요 — `p`, `m`, `bg`, `rounded`, `w`, `h`.
>
> 사용할 때는 `<Box p="200" bg="surface.default" rounded="md">` 이렇게 씁니다. 익숙한 DX죠.
>
> 결과는 — **런타임 비용 0**입니다. 클래스명을 합치는 비용밖에 없어요. styled-components처럼 매 렌더마다 스타일 객체를 만드는 게 아니라, 빌드할 때 이미 다 결정되어 있습니다.
>
> 단점도 있어요 — **사전 정의된 값만 가능**합니다. `padding="17px"` 같은 임의의 값은 못 써요.

---

## Slide 12 — Style API #2: StyleProps (runtime)

**On-slide:**

```ts
// From packages/ui/src/core/styleProps.ts

const properties = [
  'transform', 'translate', 'scale', 'rotate',
  'opacity', 'cursor',
  'transition', 'transitionDuration', 'transitionTimingFunction',
  'top', 'right', 'bottom', 'left',
  // ...
]

// Usage:
<Box opacity={0.5} translate="100px 0" transition="all 0.2s">

// Smart bonus: translate + scale + rotate auto-merge into transform
if (props.translate || props.scale || props.rotate) {
  const transforms = []
  if (props.translate) transforms.push(`translate(${props.translate})`)
  if (props.scale)     transforms.push(`scale(${props.scale})`)
  if (props.rotate)    transforms.push(`rotate(${props.rotate})`)
  style.transform = transforms.join(' ')
}
```

**Speaker script (2 min):**

> 두 번째 API는 **StyleProps**입니다. sprinkles로 못 푸는 영역을 위한 거예요.
>
> 이런 값들은 본질적으로 **동적**입니다 — opacity는 0.5일 수도 0.73일 수도 있고, translate는 사용자 입력에 따라 매번 다를 수 있죠. 이걸 atomic CSS로 사전 정의하는 건 미친 짓입니다.
>
> 그래서 이런 동적 값들은 **inline style로 런타임 처리**합니다. props에서 추출해서 style 객체로 변환해 element에 주입해요.
>
> 작은 디테일 하나 — `translate`, `scale`, `rotate`는 사용자가 따로따로 줘도 자동으로 하나의 `transform` 문자열로 합쳐집니다. 이거 안 해두면 사용자가 마지막에 준 transform이 앞 것을 덮어쓰는 버그가 나거든요.

---

## Slide 13 — The Real Decision: Hybrid

**On-slide:**

```
        ┌─────────────────────────┬──────────────────────────┐
        │  Sprinkles (build-time) │  StyleProps (runtime)    │
        ├─────────────────────────┼──────────────────────────┤
Use     │  Token-based, fixed     │  Dynamic, continuous     │
        │  spacing, color, layout │  transform, opacity      │
        ├─────────────────────────┼──────────────────────────┤
Cost    │  0 runtime              │  per-render inline style │
        ├─────────────────────────┼──────────────────────────┤
Wins    │  Bundle, perf           │  Flexibility             │
        └─────────────────────────┴──────────────────────────┘

Key insight: Pure zero-runtime is a marketing lie.
              Real systems are always hybrid.
```

**Speaker script (2 min):**

> 여기가 **오늘 발표의 가장 중요한 슬라이드**입니다.
>
> "제로 런타임 CSS"라는 마케팅을 들으면 마치 모든 스타일이 빌드 타임에 결정되는 것처럼 들리지만, **현실에서는 불가능**합니다. 사용자 인풋, 애니메이션, 동적 위치 — 이런 것들은 본질적으로 런타임이에요.
>
> 그래서 저는 **하이브리드 결정**을 했습니다.
>
> - **고정 토큰 값** (spacing, color, layout) → Sprinkles → 빌드 타임 → 런타임 비용 0
> - **동적 연속 값** (transform, opacity, transition) → StyleProps → 런타임 inline style
>
> 이 두 시스템이 **하나의 컴포넌트 API에서 공존**합니다. 사용자는 차이를 거의 못 느껴요. 그저 props를 적을 뿐이죠. 어떤 게 빌드 타임에 처리되고 어떤 게 런타임인지는 컴포넌트 내부에서 자동으로 분기됩니다.
>
> 이게 제가 시니어 분들께 가장 자랑하고 싶은 결정입니다. **"순수성"보다 "올바른 도구"를 고른 결정**이에요.

---

## Slide 14 — Bonus: Interaction Props via CSS Variables

**On-slide:**

```ts
// From packages/ui/src/components/Box/Box.tsx

<Box
  bg="surface.default"
  _hover={{ bg: "surface.hover" }}
  _active={{ bg: "surface.active" }}
>

// How it works:
// 1. extractStyleProps    → runtime inline style
// 2. extractSprinkleProps → build-time atomic class
// 3. interaction props    → CSS custom properties injected as inline style
//    + interactiveBase class consumes them via var(--hover-bg)

→ Sprinkles can't express :hover dynamically per-instance.
   CSS variables can. Use them as the bridge.
```

**Speaker script (2 min):**

> 한 가지 디테일을 더 보여드리고 싶어요. Chakra처럼 `_hover={{ bg: "..." }}` API를 만들고 싶었는데, sprinkles는 정적 atomic CSS라서 **인스턴스마다 다른 hover 색**을 표현할 수가 없습니다.
>
> 해법은 **CSS custom properties를 다리로 쓰는 것**이었어요.
>
> Box 컴포넌트를 보시면 props를 세 단계로 분리합니다 — styleProps, sprinkleProps, interactionProps. interactionProps에서 들어온 값들을 **CSS variable로 변환해서 inline style에 주입**하고, `interactiveBase`라는 클래스가 그 변수를 `:hover`에서 소비하는 구조입니다.
>
> 처음 만들 때 가장 어려웠던 부분이고, **시니어 분들이 가장 좋아하실 만한 디테일**이라고 생각합니다.

---

## Slide 15 — AI-Native Pipeline (2026 extension)

**On-slide:**

```
The same codegen mindset, now serving AI agents and Figma.

ui/scripts/generate-component-spec.ts
  src/index.ts barrel  →  components.spec.json
  (typed props, compound parts, tests, stories — via TS Compiler API)

ui/scripts/generate-llms-full.ts
  spec + tokens         →  services/web/public/llms-full.txt
  (Markdown context for Claude Code / Cursor / Codex; ~34 KB)

CLAUDE.md + AGENTS.md + .cursor/rules/
  → Hard rules: no raw colors, no new primitives in services/app,
                no deep imports, always reuse @illog/ui.

.mcp.json + scripts/figma-push/
  → Figma Dev Mode MCP (free w/ student plan) for design → code
  → DTCG token export + Figma plugin for code → Figma Variables

Cost: $0.  No Tokens Studio Pro, no story.to.design, no v0 subscription.
```

**Speaker script (2 min):**

> 자랑하고 싶은 결정 두 번째입니다 — **AI 시대에 맞춰 같은 codegen 파이프라인을 확장**했어요.
>
> 2026년 흐름은 명확합니다. AI 코딩 에이전트(Claude Code, Cursor, Codex)가 디자인 시스템을 직접 읽고 코드를 생성합니다. 그런데 에이전트한테 그냥 "이 컴포넌트 만들어"라고 하면 자기 멋대로 새 primitive를 발명해버려요. 디자인 시스템을 무시하고요.
>
> 그래서 같은 마인드셋을 적용했습니다 — **단일 진실 공급원(barrel + tokens) → 여러 소비자**.
>
> - [`generate-component-spec.ts`](packages/ui/scripts/generate-component-spec.ts)는 **TypeScript 컴파일러 API**로 barrel을 직접 파싱해서, 모든 컴포넌트의 prop 타입, compound parts, 테스트/스토리 유무를 JSON으로 추출합니다. dep 추가 없이요 — `typescript`는 어차피 깔려있으니까요.
> - [`generate-llms-full.ts`](packages/ui/scripts/generate-llms-full.ts)가 그 JSON과 토큰을 합쳐서 `llms-full.txt`라는 마크다운을 만듭니다. AI가 컨텍스트 윈도우에 통째로 올려서 읽는 파일이에요. `llmstxt.org`가 정의한 컨벤션입니다. 28개 컴포넌트 + 69개 컬러 변수가 약 34KB로 떨어집니다.
> - [`CLAUDE.md`](CLAUDE.md)와 [`AGENTS.md`](AGENTS.md), 그리고 [`.cursor/rules/`](.cursor/rules)는 에이전트가 어겨선 안 될 하드 룰을 적어둔 파일입니다. 세 포맷을 다 두는 이유는 — 2026년 기준 Claude / Cursor / Codex가 각자 다른 파일을 읽거든요.
> - 마지막으로 [`.mcp.json`](.mcp.json)에는 **Figma Dev Mode MCP** 서버를 등록했습니다. 학생 플랜에 포함된 무료 기능이에요. 디자이너가 Figma 프레임 링크를 던지면 Claude Code가 그 프레임을 직접 읽고 `@illog/ui` 컴포넌트로 변환합니다.
> - 반대 방향은 [`scripts/figma-push/`](scripts/figma-push)가 풀어요. TS 토큰을 W3C DTCG 표준 JSON으로 export하고, 직접 만든 Figma 플러그인이 그걸 Figma Variables로 동기화합니다.
>
> **결정적으로 — 유료 도구 없이 다 풀었습니다.** Tokens Studio Pro($9/seat), story.to.design($25/mo), v0 구독 — 다 안 썼어요. 무료 Figma Dev Mode MCP + 직접 짠 200줄 스크립트 + 50줄 Figma 플러그인으로 충분했습니다.
>
> 시니어 분들께 이 슬라이드에서 강조하고 싶은 건 — **새 도구가 나왔을 때 그 도구에 끌려가는 게 아니라, 기존 마인드셋이 어떻게 확장되는지를 본다**는 점입니다. 토큰 codegen이 색깔, 아이콘, 타입에 이어 **AI 컨텍스트와 Figma 변수까지** 자연스럽게 흘러가게 만든 거예요.

---

## Slide 16 — What I Got Right (and would do again)

**On-slide:**

```
✅ Token codegen pipeline (slide 10)
   → Source of truth: TS tokens
   → Outputs: CSS vars + typed TS objects
   → Designer/dev never go out of sync

✅ Hybrid build-time / runtime style API (slide 13)
   → Right tool for each kind of value
   → Sprinkles for tokens, inline style for dynamics
   → Single unified component API on top

✅ Extended codegen to feed AI agents + Figma (slide 15)
   → Same SoT philosophy, new consumers (LLMs, Figma Variables)
   → All free tooling — $0 vendor lock-in
   → Hybrid SoT: code = tokens, Figma = composition
```

**Speaker script (1.5 min):**

> 다시 한다면 또 똑같이 할 결정 세 가지입니다.
>
> 첫째, **codegen 파이프라인**. 토큰이 단일 진실 공급원이고, CSS와 TS 양쪽으로 자동 생성됩니다. 디자이너와 개발자가 절대 어긋날 수 없는 구조예요.
>
> 둘째, **하이브리드 스타일 API**. "순수 zero-runtime"의 함정에 빠지지 않고, 각 값의 특성에 맞는 도구를 선택했습니다. 사용자에겐 단일 API로 노출하고요.
>
> 셋째, **AI/Figma까지 같은 codegen 마인드셋을 확장**한 결정. 새 도구를 사는 게 아니라, 기존 구조에서 자연스럽게 흘려보냈습니다. 그리고 **하이브리드 SoT**(코드 = 토큰, Figma = 컴포지션) 결정으로 어느 한쪽도 죽이지 않았어요.
>
> 이 세 결정이 1년 동안 저를 지지해줬습니다.

---

## Slide 17 — What I Got Wrong (and wouldn't repeat)

**On-slide:**

```
❌ Built 28 components before validating 3
   → I now use ~12 of them. Half is graveyard.
   → ToggleMenu was deleted in commit b19a144.
   → Lesson: build the wall, paint it later.

❌ Made primitives feel "complete" too early
   → 6 separate size scales → I only ever used 3.
   → Should have started with `space` and split when pain appeared.
   → Lesson: don't pay for abstractions you haven't earned.
```

**Speaker script (2 min):**

> 다시 안 할 결정 두 가지입니다. 솔직하게요.
>
> 첫째, **검증 없이 28개 컴포넌트를 만들었습니다**. 지금 실제로 쓰는 건 12개 정도예요. 절반이 묘지입니다. `ToggleMenu`라는 컴포넌트를 [커밋 b19a144](../)에서 삭제한 적이 있어요 — 한 번도 안 썼거든요.
>
> 교훈: **벽을 먼저 쌓고, 색칠은 나중에 한다**. 컴포넌트 3개만 먼저 만들고, 그게 진짜 필요해질 때 다음 컴포넌트를 만들었어야 했어요.
>
> 둘째, **primitives를 너무 일찍 "완성된 것처럼" 만들었습니다**. 사이즈 토큰을 6개로 쪼갰다고 말씀드렸죠? 솔직히 그 중 3개만 실제로 의미 있게 쓰고 있어요. `space` 하나로 시작해서 진짜 아픔이 생길 때 분리했어야 했습니다.
>
> 교훈: **번 적 없는 추상화에 비용을 치르지 마라**. 이건 시니어 분들이 늘 말씀하시는 YAGNI인데, 제가 직접 어겨보고 나서야 진짜로 이해했습니다.

---

## Slide 18 — Honest Limits of a Personal DS

**On-slide:**

```
What I cannot claim:

⚠ Scale validation         — 1 user, not 100 designers
⚠ Cross-team contract      — no negotiations, no rejections
⚠ Versioning discipline    — I am the only consumer
⚠ A11y audit at scale      — I tested with my own ears
⚠ Figma plugin in prod     — DTCG export validated, plugin not yet
                             distributed to other designers

What I can claim:

✓ Every decision in this DS is one I personally own and can defend.
```

**Speaker script (1.5 min):**

> 솔직한 한계를 짚고 가야 합니다. 안 그러면 시니어 분들이 속으로 "근데 이거 너 혼자 쓰잖아"라고 생각하실 거니까요.
>
> 제가 **주장할 수 없는 것들** — 규모 검증, 크로스 팀 계약, 버저닝 규율, 대규모 접근성 검수. 그리고 솔직히 어제 추가한 Figma 플러그인 부분은 — DTCG export까지는 검증됐지만, 다른 디자이너에게 배포해서 운영해본 단계는 아직 아닙니다.
>
> 이건 전부 회사 환경에서만 배울 수 있는 것들입니다.
>
> 하지만 제가 **주장할 수 있는 한 가지** — 이 디자인 시스템 안의 **모든 결정에 대해 제가 직접 책임지고 방어할 수 있다**는 점입니다.
>
> 사용자가 한 명이라서 오히려 **모든 결정의 근거를 제가 책임질 수 있었어요**. 회사에서는 시니어가 깔아놓은 길을 걷지만, 여기서는 길을 직접 깔아야 했습니다. 그 과정에서 배운 게 진짜였어요.

---

## Slide 19 — Closing

**On-slide:**

```
What I want to bring to your team:

1. Trade-off thinking, not framework loyalty
2. Source-of-truth discipline (codegen mindset)
3. Willingness to delete my own code (YAGNI in practice)
4. Comfort with "I don't know yet — let me try"
5. Building for AI consumers, not just human ones

The DS isn't the artifact.
The judgment behind it is.

Thank you.
```

**Speaker script (1.5 min):**

> 마무리하겠습니다.
>
> 오늘 보여드린 디자인 시스템 자체는 사실 결과물이에요. 제가 여러분 팀에 가져가고 싶은 건 결과물이 아니라 **그 뒤의 판단들**입니다.
>
> 첫째, **프레임워크 충성심이 아닌 trade-off 사고**. 어떤 도구든 제약이 있고, 그 제약이 우리 상황과 맞는지 따집니다.
>
> 둘째, **단일 진실 공급원에 대한 규율**. codegen 마인드셋으로 어디서든 출처가 명확한 데이터를 만듭니다.
>
> 셋째, **제가 짠 코드를 지울 수 있는 의지**. 28개 만들고 일부 지운 경험이 있습니다.
>
> 넷째, **"아직 모르겠는데 한번 해볼게요"가 편한 마음**. 이게 3년차의 가장 큰 무기라고 생각합니다.
>
> 그리고 다섯째 — **AI 소비자도 1급 시민으로 보는 시각**. 2026년의 디자인 시스템은 사람만 읽지 않아요. Claude, Cursor, Codex, Figma Make가 모두 우리 시스템의 잠재 소비자입니다. 이걸 사후 대응이 아니라 codegen의 자연스러운 확장으로 풀었습니다.
>
> 디자인 시스템은 산물입니다. 그 뒤의 판단이 진짜입니다.
>
> 감사합니다.

---

## Appendix A — Q&A Preparation

### Q1. "Why didn't you just use shadcn/ui?"

**A**: Slide 5 답변 + 한 문장 강조: _"shadcn은 잘못된 도구가 아니라 제 제약에 안 맞는 도구였습니다. Tailwind 없는 vanilla-extract 환경에서 토큰 계약을 type-safe하게 강제하고 싶었어요."_

### Q2. "Vanilla-extract is niche. What about Panda CSS or StyleX?"

**A**: _"좋은 질문입니다. Panda CSS와 StyleX는 제가 시작할 때 ecosystem이 덜 성숙했습니다. 지금 새로 시작한다면 Panda CSS를 진지하게 검토할 거예요. 두 도구 모두 제가 추구한 'token + zero-runtime + type-safe' 방향성에 부합합니다."_

### Q3. "28개 컴포넌트 중 안 쓰는 게 몇 개?"

**A**: 정확한 숫자 미리 카운트해두기. 예: _"실제 활용 12개, 부분 활용 6개, 완전히 죽은 컴포넌트가 나머지. ToggleMenu는 이미 삭제했고, 다음 후보는 X, Y입니다."_

### Q4. "Token codegen — Style Dictionary는 안 써봤어요?"

**A**: _"써봤고 검토했습니다. Style Dictionary는 멀티 플랫폼 출력(iOS, Android)이 강점인데 저는 web만 필요했습니다. 그래서 100줄짜리 [build-css-themes.ts](packages/themes/scripts/build-css-themes.ts)로 충분했어요. 팀이 모바일까지 가면 Style Dictionary로 마이그레이션할 겁니다. 지금 토큰을 DTCG 표준으로 export하고 있어서 마이그레이션 비용이 낮습니다."_

### Q5. "Hybrid 결정 — 그냥 styled-components 쓰면 되지 않나?"

**A**: _"styled-components는 모든 스타일이 런타임입니다. 저는 토큰 기반 95%를 빌드 타임으로 보내고, 5% 동적 값만 런타임 비용을 내고 싶었어요. 비용을 받을 가치가 있을 때만 받게 하는 거죠."_

### Q6. "CSS variable 기반 hover — 그냥 :hover 클래스로 충분하지 않나?"

**A**: _"같은 컴포넌트가 인스턴스마다 다른 hover 색을 가질 수 있어야 했습니다. 정적 클래스로는 N개 인스턴스 × M개 색의 조합 폭발이 일어나요. CSS variable은 인스턴스 단위로 값을 주입할 수 있어 이 문제를 해결합니다."_

### Q7. "테스팅 전략은?"

**A**: _"vitest + testing-library/react로 컴포넌트 단위 테스트를 합니다. [Box.test.tsx](packages/ui/src/components/Box/Box.test.tsx)에서 보시면 props 합성, ref 전달, polymorphic `as` prop 같은 핵심 계약을 테스트합니다. Visual regression은 아직 없어요 — 다음 단계입니다."_

### Q8. "접근성은?"

**A**: _"솔직히 약점입니다. 키보드 내비게이션과 ARIA는 신경 썼지만, 스크린 리더 실사용 테스트는 안 했어요. 회사 환경이라면 axe-core 자동화 + 사용자 테스트 둘 다 했을 겁니다."_

### Q9. "Bundle size 실제 수치는?"

**A**: 발표 전에 `pnpm size` 돌려서 정확한 수치 준비. 예: _"@illog/ui gzip 12KB, @illog/themes gzip 3KB. Sprinkles 덕분에 사용한 atomic 클래스만 번들에 들어갑니다."_

### Q10. "다음에 추가하고 싶은 기능?"

**A**: _"세 가지요. (1) Visual regression(Chromatic 또는 Playwright). (2) Figma Code Connect 연동(`_.figma.tsx`로 컴포넌트 매핑 publish). (3) Token contract 위반을 잡는 ESLint 룰."\*

### Q11. "AI 에이전트 통합 — 그냥 hype 아닌가요? 실제로 뭐가 좋아져요?"

**A**: _"Hype 부분은 분명히 있어요. 하지만 제가 푼 구체적인 문제는 — '에이전트가 같은 컴포넌트를 두 번 만드는 문제'입니다. 에이전트한테 그냥 '버튼 만들어'라고 하면 `<button>`을 새로 짭니다. `@illog/ui`의 `Button`이 있는데도요. [`llms-full.txt`](services/web/public/llms-full.txt)와 [`CLAUDE.md`](CLAUDE.md)는 그 갭을 메우는 contract입니다. 측정 가능한 효과는 — 새 PR에서 raw 색깔/스페이싱 위반이 사라졌고, 'services/app에 새 primitive 추가' 시도가 0으로 떨어졌어요."_

### Q12. "Figma Variables sync — Tokens Studio 쓰는 게 더 편하지 않아요?"

**A**: _"Tokens Studio Pro는 $9/seat/월입니다. 디자이너가 늘면 비용이 따라 늘어요. 저는 (1) DTCG 표준으로 토큰을 export하고 (2) 50줄짜리 직접 만든 Figma 플러그인이 그걸 import해서 Variables로 쓰는 길을 택했습니다. Tokens Studio가 주는 부가 기능 — 컬렉션 분리, 모드 전환, alias 해석 — 중에 필요한 것만 직접 구현했어요. 무료 + 우리 토큰 구조에 정확히 맞춤입니다. 디자인 팀이 5명을 넘어가면 Tokens Studio로 마이그레이션할 가치가 생기겠지만, 지금은 아닙니다."_

### Q13. "Figma Code Connect는 왜 안 했어요?"

**A**: _"Code Connect는 [`_.figma.tsx`](packages/ui)를 컴포넌트마다 짜고 `npx figma connect publish`로 올리는 OSS CLI입니다. 다음 단계로 계획돼 있어요(슬라이드 18 limits 참고). 지금은 Dev Mode MCP만으로 design → code 흐름이 충분해서, 28개 컴포넌트 매핑 비용을 아직 안 치렀습니다. 디자이너가 본격적으로 Code Connect의 'view code' 기능을 써야 할 시점에 짤 거예요."\*

---

## Appendix B — Demo Checklist

> 라이브 데모는 위험 → **미리 녹화한 30초 GIF + 코드 스니펫 캡처** 권장

데모로 보여줄 시퀀스:

1. **토큰 변경 → 자동 반영** (10초)
   - `themes/tokens/colors/light.ts` 수정 → CSS var 변경 → IDE 자동완성 변경
2. **Style API 차이** (15초)
   - `<Box p="200">` → DevTools에서 atomic class 확인
   - `<Box opacity={0.5}>` → DevTools에서 inline style 확인
3. **Hover CSS variable trick** (15초)
   - `<Box _hover={{ bg: "surface.hover" }}>` → DevTools에서 `--hover-bg` CSS var 확인
4. **AI-Native pipeline** (20초) — _NEW_
   - Figma 프레임 링크를 Claude Code에 붙여넣음 → MCP가 프레임을 fetch → `llms-full.txt`를 컨텍스트로 읽고 `@illog/ui` 컴포넌트로 변환된 TSX 출력
   - 또는 `pnpm gen:ai-context` 실행 → `components.spec.json` + `llms-full.txt` 즉시 갱신되는 모습

---

## Appendix C — Slide Visual Guide

| 슬라이드                     | 비주얼 권장                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| 1 (Title)                    | 큰 타이틀, 부제목 작게, 본인 이름 + 연도                                                     |
| 4 (Landscape)                | 4-quadrant 비교표 또는 가로 막대                                                             |
| 6 (Architecture)             | 박스 다이어그램 (themes ← ui)                                                                |
| 7-9 (Tokens)                 | 디렉토리 트리 + 한 줄 설명                                                                   |
| 10 (Codegen)                 | 화살표 다이어그램 (TS → CSS → TS)                                                            |
| 11-12 (Sprinkles/StyleProps) | 코드 + 캡션                                                                                  |
| 13 (Hybrid)                  | 비교표 (가장 큰 글자, 가장 적은 텍스트)                                                      |
| 14 (Interaction)             | Box 컴포넌트 코드 + 화살표 다이어그램                                                        |
| 15 (AI-Native)               | 4분기 다이어그램: barrel → spec → llms-full.txt + tokens → DTCG → Figma. "$0 cost" 강조 박스 |
| 16-17 (Right/Wrong)          | 체크/엑스 큰 아이콘 + 짧은 텍스트                                                            |
| 19 (Closing)                 | 5개 bullet + 마지막 한 줄 강조                                                               |

---

## Appendix D — Timing Cheat Sheet

| 슬라이드                       | 분           | 누적 |
| ------------------------------ | ------------ | ---- |
| 1. Title                       | 1            | 1    |
| 2. Today's Question            | 1            | 2    |
| 3. Context                     | 1            | 3    |
| 4. Landscape                   | 1.5          | 4.5  |
| 5. Why Not shadcn              | 1.5          | 6    |
| 6. Architecture                | 1.5          | 7.5  |
| 7. Color tokens                | 1.5          | 9    |
| 8. Size tokens                 | 1.5          | 10.5 |
| 9. Typography                  | 1.5          | 12   |
| 10. Codegen                    | 2            | 14   |
| 11. Sprinkles                  | 2            | 16   |
| 12. StyleProps                 | 1.5          | 17.5 |
| 13. Hybrid (key slide)         | 1.5          | 19   |
| 14. Interaction (skip if late) | 1            | 20   |
| 15. AI-Native (key slide)      | 2            | 22   |
| 16-17. Right/Wrong             | 2 (combined) | 24   |
| 18. Limits                     | 1            | 25   |
| 19. Closing                    | 1            | 26   |

> 26분 디자인 → 실전 22분 안에 들어옴 (보통 +20% 빨라짐)
> 시간 부족 시 슬라이드 14 스킵 가능 (Hybrid에 자연스럽게 흡수됨)
> 슬라이드 15는 AI 시대 hiring signal이라 가능한 한 유지 권장

---

## 검증 메모 (작성자 → 발표자)

이 발표문의 모든 기술적 주장은 illog 코드베이스에서 직접 확인된 것입니다:

**Core DS (slides 1–14, 16–17):**

- ✅ 2-package split: [packages/themes/](packages/themes), [packages/ui/](packages/ui)
- ✅ Color primitive/light/dark: [packages/themes/src/tokens/colors/](packages/themes/src/tokens/colors/)
- ✅ Size 6분리: [packages/themes/src/tokens/size/](packages/themes/src/tokens/size/)
- ✅ Typography 2단: [packages/themes/src/tokens/typography/](packages/themes/src/tokens/typography/)
- ✅ Codegen 3종: [packages/themes/scripts/build-css-themes.ts](packages/themes/scripts/build-css-themes.ts), [packages/ui/scripts/generate-color-objects.ts](packages/ui/scripts/generate-color-objects.ts), [packages/ui/scripts/generate-icons.ts](packages/ui/scripts/generate-icons.ts)
- ✅ Sprinkles 정의: [packages/ui/src/core/sprinkles.css.ts](packages/ui/src/core/sprinkles.css.ts)
- ✅ StyleProps 정의: [packages/ui/src/core/styleProps.ts](packages/ui/src/core/styleProps.ts)
- ✅ Box 3-layer 합성: [packages/ui/src/components/Box/Box.tsx](packages/ui/src/components/Box/Box.tsx)
- ✅ ToggleMenu 삭제 커밋: b19a144

**AI-Native pipeline (slide 15):**

- ✅ Component spec extractor (TS Compiler API): [packages/ui/scripts/generate-component-spec.ts](packages/ui/scripts/generate-component-spec.ts)
- ✅ llms-full.txt generator: [packages/ui/scripts/generate-llms-full.ts](packages/ui/scripts/generate-llms-full.ts)
- ✅ Generated AI context: [packages/ui/components.spec.json](packages/ui/components.spec.json), [services/web/public/llms-full.txt](services/web/public/llms-full.txt) (28 components, 69 color vars, ~34 KB)
- ✅ Agent guidance (3 formats): [CLAUDE.md](CLAUDE.md), [packages/ui/CLAUDE.md](packages/ui/CLAUDE.md), [AGENTS.md](AGENTS.md), [.cursor/rules/illog-ui.mdc](.cursor/rules/illog-ui.mdc)
- ✅ Figma Dev Mode MCP config + setup: [.mcp.json](.mcp.json), [docs/figma-mcp-setup.md](docs/figma-mcp-setup.md)
- ✅ Token DTCG export + Figma plugin: [scripts/figma-push/](scripts/figma-push), [scripts/figma-push/export-tokens.ts](scripts/figma-push/export-tokens.ts), [scripts/figma-push/tokens.dtcg.json](scripts/figma-push/tokens.dtcg.json), [scripts/figma-push/plugin/](scripts/figma-push/plugin)
- ✅ npm scripts: `pnpm gen:ai-context` (root), `pnpm --filter @illog/ui gen:spec | gen:llms | gen:ai-context`, `pnpm figma:export-tokens`

발표 전에 한 번 더 직접 코드를 열어 슬라이드와 매칭해보시기를 권장합니다.
