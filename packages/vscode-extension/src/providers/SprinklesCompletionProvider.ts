import {
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  MarkdownString,
  Position,
  ProviderResult,
  Range,
  TextDocument
} from 'vscode'
import { TokenRegistry, ColorToken } from '../registry/TokenRegistry'
import { generateColorSvg, parseColor } from '../utils/color'

const SPACE_PROPS = new Set([
  'gap',
  'gridGap',
  'columnGap',
  'rowGap',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'm',
  'mt',
  'mr',
  'mb',
  'ml',
  'mx',
  'my',
  'p',
  'pt',
  'pr',
  'pb',
  'pl',
  'px',
  'py'
])

const BG_COLOR_PROPS = new Set(['bg', 'backgroundColor'])
const TEXT_COLOR_PROPS = new Set(['color'])
const BORDER_COLOR_PROPS = new Set([
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor'
])
const RADIUS_PROPS = new Set(['rounded', 'borderRadius'])
const SHADOW_PROPS = new Set(['shadow', 'boxShadow'])

type PropCategory = 'space' | 'bgColor' | 'textColor' | 'borderColor' | 'radius' | 'shadow'

function getPropCategory(propName: string): PropCategory | null {
  if (SPACE_PROPS.has(propName)) return 'space'
  if (BG_COLOR_PROPS.has(propName)) return 'bgColor'
  if (TEXT_COLOR_PROPS.has(propName)) return 'textColor'
  if (BORDER_COLOR_PROPS.has(propName)) return 'borderColor'
  if (RADIUS_PROPS.has(propName)) return 'radius'
  if (SHADOW_PROPS.has(propName)) return 'shadow'
  return null
}

interface PropContext {
  propName: string
  typed: string
}

/**
 * @lineUptoCursor 현재 커서까지의 한 줄 문자열 (예: `<Box p="1` 이면 `lineUptoCursor`는 `<Box p="1`이 됨)
 *
 */
function detectPropContext(lineUptoCursor: string): PropContext | null {
  // Match: 연속된 단어 문자들을 캡처해서 그 뒤에 = 기호가 있고 값이 시작되는 패턴(따옴표가 아니고 이 패턴이 문자열 끝에서 일치해야 함)
  const match = lineUptoCursor.match(/(\w+)=(?:["']|[{]["'])([^"']*)$/)
  if (!match) return null
  return { propName: match[1], typed: match[2] } // propName: p, typed: 1
}

export class SprinklesCompletionProvider implements CompletionItemProvider {
  constructor(private registry: TokenRegistry) {}

  provideCompletionItems(
    document: TextDocument,
    position: Position
  ): ProviderResult<CompletionItem[]> {
    const lineUptoCursor = document.getText(
      new Range(position.line, 0, position.line, position.character)
    )

    const ctx = detectPropContext(lineUptoCursor)
    if (!ctx) return null

    const category = getPropCategory(ctx.propName)
    if (!category) return null

    switch (category) {
      case 'space':
        return this.spaceCompletions()
      case 'radius':
        return this.radiusCompletions()
      case 'shadow':
        return this.shadowCompletions()
      case 'bgColor':
        return this.colorCompletions('background')
      case 'textColor':
        return this.colorCompletions('text')
      case 'borderColor':
        return this.colorCompletions('border')
    }
  }

  private spaceCompletions(): CompletionItem[] {
    return this.registry
      .getAllSizeTokens()
      .filter((t) => t.category === 'space')
      .map((t) => {
        const item = new CompletionItem(
          {
            label: t.key, // e.g. "100"
            detail: `  ${t.value}px` // e.g. "  4px" (2 spaces for alignment)
          },
          CompletionItemKind.Unit
        )
        item.insertText = t.key
        item.detail = `${t.value}px`
        if (t.value > 0) {
          item.documentation = new MarkdownString(
            `**space.${t.key}** → \`${t.value}px\` · \`${t.value / 16}rem\`` // e.g. "space.100 → `4px` · `0.25rem`"
          )
        }

        item.sortText =
          t.value >= 0
            ? `0_${String(t.value).padStart(6, '0')}`
            : `1_${String(-t.value).padStart(6, '0')}`
        return item
      })
  }

  private radiusCompletions(): CompletionItem[] {
    return this.registry
      .getAllSizeTokens()
      .filter((t) => t.category === 'radius')
      .map((t) => {
        const item = new CompletionItem(
          { label: t.key, detail: `  ${t.value === 9999 ? '∞' : t.value + 'px'}` }, // e.g. "100" with detail "  4px", "9999" with detail "  ∞"
          CompletionItemKind.Unit
        )
        item.insertText = t.key
        item.documentation = new MarkdownString(`**radius.${t.key}** → \`${t.value}px\``) // e.g. "radius.100 → `4px`"
        return item
      })
  }

  private shadowCompletions(): CompletionItem[] {
    return this.registry.getAllShadowTokens().map((t) => {
      const item = new CompletionItem(
        { label: t.key, detail: `  shadow-${t.key}` }, // e.g. "100" with detail "  shadow-100"
        CompletionItemKind.Unit
      )
      item.insertText = t.key
      item.documentation = new MarkdownString(`**shadow.${t.key}**\n\n\`\`\`\n${t.css}\n\`\`\``)
      item.sortText = t.key.padStart(4, '0')
      return item
    })
  }

  private colorCompletions(prefix: 'background' | 'text' | 'border' | 'icon'): CompletionItem[] {
    return this.registry
      .getAllColorTokens()
      .filter((t) => t.camelName.toLowerCase().startsWith(prefix))
      .map((t) => this.colorItem(t))
  }

  private colorItem(token: ColorToken): CompletionItem {
    const { camelName, lightValue, darkValue, cssVar } = token

    const item = new CompletionItem(
      { label: camelName, detail: `  ${lightValue}` },
      CompletionItemKind.Color
    )
    item.insertText = camelName
    item.filterText = camelName
    item.sortText = camelName

    const md = new MarkdownString('', true)
    md.isTrusted = true
    md.supportHtml = true

    const lightSvg = generateColorSvg(lightValue)
    const darkSvg = generateColorSvg(darkValue)

    md.appendMarkdown(`**${camelName}**\n\n`)
    md.appendMarkdown(`![light](${lightSvg}) Light: \`${lightValue}\`\n\n`)
    if (darkValue !== lightValue) {
      md.appendMarkdown(`![dark](${darkSvg}) Dark:  \`${darkValue}\`\n\n`)
    }
    md.appendMarkdown(`CSS: \`var(${cssVar})\``)
    item.documentation = md

    // 컬러 사각형 박스 보이게 하기
    const parsed = parseColor(lightValue)
    if (parsed) {
      // TODO: 일부 테마에서 지원되지 않을 수 있으므로 나중에 발견하면 그때 추가 수정 필요
    }

    return item
  }
}
