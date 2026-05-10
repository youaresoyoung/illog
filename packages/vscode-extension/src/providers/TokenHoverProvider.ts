import {
  Hover,
  HoverProvider,
  MarkdownString,
  Position,
  ProviderResult,
  Range,
  TextDocument
} from 'vscode'
import { TokenRegistry } from '../registry/TokenRegistry'
import { generateColorSvg } from '../utils/color'

export class TokenHoverProvider implements HoverProvider {
  constructor(private registry: TokenRegistry) {}

  provideHover(document: TextDocument, position: Position): ProviderResult<Hover> {
    const line = document.lineAt(position.line).text

    // 1. import 스타일: backgroundColors.xxx, textColors.xxx 등 (.css.ts 파일)
    const colorResult = this.matchColorToken(line, position)
    if (colorResult) return colorResult

    // 2. JSX prop 컬러: bg="backgroundBrandDefault", color="textDefault" 등
    const jsxColorResult = this.matchJsxColorProp(line, position)
    if (jsxColorResult) return jsxColorResult

    // 3. JSX prop 라디우스: rounded="200"
    const jsxRadiusResult = this.matchJsxRadiusProp(line, position)
    if (jsxRadiusResult) return jsxRadiusResult

    // 4. JSX prop 섀도우: shadow="100"
    const jsxShadowResult = this.matchJsxShadowProp(line, position)
    if (jsxShadowResult) return jsxShadowResult

    // 5. 직접 토큰 접근: tokens.size.space['400'], tokens.size.radius[200]
    const sizeResult = this.matchSizeToken(line, position)
    if (sizeResult) return sizeResult

    // 6. sprinkles 오브젝트 스타일: gap: '400', p: '200' 등 + JSX gap="400"
    const sprinklesResult = this.matchSprinklesSpace(line, position)
    if (sprinklesResult) return sprinklesResult

    return null
  }

  private matchJsxColorProp(line: string, position: Position): Hover | null {
    const regex =
      /(?:bg|backgroundColor|color|borderColor|borderTopColor|borderRightColor|borderBottomColor|borderLeftColor)\s*=\s*["'](\w+)["']/g
    let match: RegExpExecArray | null
    while ((match = regex.exec(line))) {
      const start = match.index
      const end = start + match[0].length
      if (position.character < start || position.character > end) continue
      const token = this.registry.getColorToken(match[1])
      if (!token) return null
      return new Hover(
        this.buildColorHoverContent(
          token.camelName,
          token.cssVar,
          token.lightValue,
          token.darkValue
        ),
        new Range(position.line, start, position.line, end)
      )
    }
    return null
  }

  private matchJsxRadiusProp(line: string, position: Position): Hover | null {
    const regex = /(?:rounded|borderRadius)\s*=\s*["'](\w+)["']/g
    let match: RegExpExecArray | null
    while ((match = regex.exec(line))) {
      const start = match.index
      const end = start + match[0].length
      if (position.character < start || position.character > end) continue
      const token = this.registry.getSizeToken('radius', match[1])
      if (!token) return null
      return new Hover(
        this.buildSizeHoverContent('radius', match[1], token.value),
        new Range(position.line, start, position.line, end)
      )
    }
    return null
  }

  private matchJsxShadowProp(line: string, position: Position): Hover | null {
    const regex = /(?:shadow|boxShadow)\s*=\s*["'](\w+)["']/g
    let match: RegExpExecArray | null
    while ((match = regex.exec(line))) {
      const start = match.index
      const end = start + match[0].length
      if (position.character < start || position.character > end) continue
      const shadowToken = this.registry.getShadowToken(match[1])
      if (!shadowToken) return null
      const md = new MarkdownString('', true)
      md.isTrusted = true
      md.appendMarkdown(`**shadow.${match[1]}**\n\n---\n\n`)
      md.appendMarkdown(`\`\`\`\n${shadowToken.css}\n\`\`\``)
      return new Hover(md, new Range(position.line, start, position.line, end))
    }
    return null
  }

  private matchColorToken(line: string, position: Position): Hover | null {
    // Match: backgroundColors.xxx, textColors.xxx, borderColors.xxx, iconColors.xxx
    const regex = /(?:backgroundColors|textColors|borderColors|iconColors)\.(\w+)/g
    let match: RegExpExecArray | null

    while ((match = regex.exec(line))) {
      const start = match.index
      const end = start + match[0].length

      if (position.character >= start && position.character <= end) {
        const camelName = match[1]
        const token = this.registry.getColorToken(camelName)
        if (!token) return null

        return new Hover(
          this.buildColorHoverContent(
            token.camelName,
            token.cssVar,
            token.lightValue,
            token.darkValue
          ),
          new Range(position.line, start, position.line, end)
        )
      }
    }

    return null
  }

  private matchSizeToken(line: string, position: Position): Hover | null {
    // Match: tokens.size.space['400'] or tokens.size.space["400"] or tokens.size.radius[200]
    const regex = /tokens\.size\.(space|radius|icon|depth|blur|stroke)\[['"]?(\w+)['"]?\]/g
    let match: RegExpExecArray | null

    while ((match = regex.exec(line)) !== null) {
      const start = match.index
      const end = start + match[0].length

      if (position.character >= start && position.character <= end) {
        const category = match[1]
        const key = match[2]
        const token = this.registry.getSizeToken(category, key)
        if (!token) return null

        return new Hover(
          this.buildSizeHoverContent(category, key, token.value),
          new Range(position.line, start, position.line, end)
        )
      }
    }

    return null
  }

  private matchSprinklesSpace(line: string, position: Position): Hover | null {
    // Match sprinkles-style: gap: '400', m: '200', p: '100', padding: '600' etc.
    // Only match known space token keys
    const regex =
      /(?:gap|margin|padding|m|mt|mr|mb|ml|mx|my|p|pt|pr|pb|pl|px|py|rowGap|columnGap|gridGap)\s*[:=]\s*['"](\d+|negative\d+)['"]/g
    let match: RegExpExecArray | null

    while ((match = regex.exec(line)) !== null) {
      // Focus on the value part (the quoted number)
      const valueStr = match[1]
      const valueStart = match.index + match[0].lastIndexOf(valueStr)
      const valueEnd = valueStart + valueStr.length

      if (position.character >= valueStart && position.character <= valueEnd) {
        const token = this.registry.getSizeToken('space', valueStr)
        if (!token) return null

        return new Hover(
          this.buildSizeHoverContent('space', valueStr, token.value),
          new Range(position.line, valueStart, position.line, valueEnd)
        )
      }
    }

    return null
  }

  private buildColorHoverContent(
    name: string,
    cssVar: string,
    lightValue: string,
    darkValue: string
  ): MarkdownString {
    const md = new MarkdownString('', true) // 빈 마크다운 + 테마아이콘 지원
    md.isTrusted = true // 이미지/svg 신뢰
    md.supportHtml = true // svg 렌더링 허용

    const lightSvg = generateColorSvg(lightValue)
    const darkSvg = generateColorSvg(darkValue)

    md.appendMarkdown(`**${name}**\n\n`)
    md.appendMarkdown(`---\n\n`)
    md.appendMarkdown(`![light](${lightSvg})&nbsp; Light: \`${lightValue}\`\n\n`)
    md.appendMarkdown(`![dark](${darkSvg})&nbsp; Dark: \`${darkValue}\`\n\n`)
    md.appendMarkdown(`CSS: \`var(${cssVar})\``)

    return md
  }

  private buildSizeHoverContent(category: string, key: string, value: number): MarkdownString {
    const md = new MarkdownString('', true)
    md.isTrusted = true

    const unit = category === 'depth' ? '' : 'px'
    md.appendMarkdown(`**${category}.${key}**\n\n`)
    md.appendMarkdown(`---\n\n`)
    md.appendMarkdown(`Value: \`${value}${unit}\``)

    if (category === 'space' && value > 0) {
      md.appendMarkdown(`  ·  \`${value / 16}rem\``)
    }

    return md
  }
}
