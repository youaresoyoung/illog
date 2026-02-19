import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

export type ColorToken = {
  type: 'color'
  camelName: string
  cssVar: string
  lightValue: string
  darkValue: string
}

type SizeCategory = 'space' | 'radius' | 'icon' | 'depth' | 'blur' | 'stroke'

export type SizeToken = {
  type: 'size'
  key: string
  value: number
  category: SizeCategory
}

export type ShadowToken = {
  type: 'shadow'
  key: string
  css: string
}

export type Token = ColorToken | SizeToken | ShadowToken

// Pre-computed shadow CSS values (from dropShadow.ts × depth/blur/black tokens).
// These rarely change so we hardcode rather than parsing TypeScript at runtime.
const SHADOW_TOKENS: Record<string, string> = {
  '100': '0px 1px 4px 0px rgba(0,0,0,0.05)',
  '200': '0px 1px 4px 0px rgba(0,0,0,0.05), 0px 1px 4px 0px rgba(0,0,0,0.05)',
  '300': '0px 4px 4px -1px rgba(0,0,0,0.1), 0px 4px 4px -1px rgba(0,0,0,0.05)',
  '400': '0px 16px 32px -4px rgba(0,0,0,0.1), 0px 4px 4px -4px rgba(0,0,0,0.05)',
  '500': '0px 16px 16px -8px rgba(0,0,0,0.1), 0px 4px 4px -4px rgba(0,0,0,0.05)',
  '600': '0px 16px 32px -8px rgba(0,0,0,0.2)'
}

export class TokenRegistry {
  private lightColor = new Map<string, string>() // { "--background-default-default": "#ffffff", ... }
  private darkColor = new Map<string, string>() // { "--background-default-default": "#1e1e1e", ... }
  private camelToCssVar = new Map<string, string>() // { "backgroundDefaultDefault": "--background-default-default", ... }
  private colorTokens = new Map<string, ColorToken>() // { "backgroundDefaultDefault": { type: 'color', camelName: 'backgroundDefaultDefault', cssVar: '--background-default-default', lightValue: '#ffffff', darkValue: '#1e1e1e' }, ... }
  private sizeTokens = new Map<string, SizeToken>() // { "--space-100": { type: 'size', key: '100', value: 4, category: 'space' }, ... }
  private shadowTokens = new Map<string, ShadowToken>() // { "100": { type: 'shadow', key: '100', css: '0px 1px 4px 0px rgba(0,0,0,0.05)' }, ... }

  private workspaceRoot: string

  constructor(workspaceRoot: string) {
    this.workspaceRoot = workspaceRoot
  }

  load(): void {
    this.loadThemesCSS()
    this.loadGeneratedColors()
    this.buildColorTokens()
    this.loadSizeTokens()
    this.loadShadowTokens()
  }

  private loadShadowTokens(): void {
    this.shadowTokens.clear()
    for (const [key, css] of Object.entries(SHADOW_TOKENS)) {
      this.shadowTokens.set(key, { type: 'shadow', key, css })
    }
  }

  private loadThemesCSS(): void {
    const cssPath = join(this.workspaceRoot, 'packages/themes/dist/themes.css')

    if (!existsSync(cssPath)) {
      return
    }
    const css = readFileSync(cssPath, 'utf-8')

    const blocks = this.parseCssBlocks(css)

    for (const block of blocks) {
      const isDark = block.selector.includes('.theme-dark')
      const varRegex = /--([\w-]+)\s*:\s*([^;]+);/g
      let match: RegExpExecArray | null

      while ((match = varRegex.exec(block.body))) {
        const varName = `--${match[1]}` // e.g. "--background-default-default"
        const value = match[2].trim() // e.g. "#ffffff"

        if (isDark) {
          this.darkColor.set(varName, value)
        } else {
          this.lightColor.set(varName, value)
        }
      }
    }
  }

  /**
   * @css :root {
   * --background-default-default: #ffffff; ...}
   *
   * @return output: [
   *  { selector: ':root', body: '--background-default-default: #ffffff; ...' },
   *  { selector: ':root .theme-dark', body: '--background-default-default: #000000; ...' },
   *   ...
   * ]
   */
  private parseCssBlocks(css: string) {
    const blocks: Array<{ selector: string; body: string }> = []
    // Match blocks like: :root { ... } and :root .theme-dark { ... }
    const regex = /([^{]+)\{([^}]+)\}/g
    let match: RegExpExecArray | null

    while ((match = regex.exec(css))) {
      blocks.push({
        selector: match[1].trim(),
        body: match[2].trim()
      })
    }

    return blocks
  }

  private loadGeneratedColors(): void {
    const genPath = join(this.workspaceRoot, 'packages/ui/src/core/tokens/generatedColors.ts')
    if (!existsSync(genPath)) {
      return
    }
    const content = readFileSync(genPath, 'utf-8')

    // Match: backgroundTagPurple: 'var(--background-tag-purple)',
    const regex = /(\w+)\s*:\s*'var\((--[\w-]+)\)'/g
    let match: RegExpExecArray | null

    while ((match = regex.exec(content))) {
      this.camelToCssVar.set(match[1], match[2])
    }
  }

  private buildColorTokens(): void {
    for (const [camel, cssVar] of this.camelToCssVar) {
      const lightValue = this.lightColor.get(cssVar) ?? ''
      const darkValue = this.darkColor.get(cssVar) ?? ''

      this.colorTokens.set(camel, {
        type: 'color',
        camelName: camel, // e.g. "backgroundDefaultDefault"
        cssVar, // e.g. "--background-default-default"
        lightValue, // e.g. "#ffffff"
        darkValue // e.g. "#1e1e1e"
      })
    }
  }

  private loadSizeTokens(): void {
    const sizeCategories: Partial<Record<string, SizeCategory>> = {
      space: 'space',
      radius: 'radius',
      icon: 'icon',
      depth: 'depth',
      blur: 'blur',
      stroke: 'stroke'
    }

    // lightColor 맵을 순회해서 사이즈 관련 CSS 변수만 추출
    for (const [cssVar, value] of this.lightColor) {
      const varName = cssVar.slice(2) // "--space-400" → "space-400"
      const dashIdx = varName.indexOf('-') // 첫 번째 대시만 사용
      if (dashIdx === -1) continue

      const prefix = varName.slice(0, dashIdx) // "space"
      const category = sizeCategories[prefix]
      if (!category) continue

      const key = varName.slice(dashIdx + 1) // "400" or "negative100"
      const numVal = parseFloat(value)
      if (isNaN(numVal)) continue

      // getSizeToken(category, key)와 일치하는 복합키로 저장
      this.sizeTokens.set(`${category}.${key}`, {
        type: 'size',
        key,
        value: numVal,
        category
      })
    }
  }

  getColorToken(camelName: string): ColorToken | undefined {
    return this.colorTokens.get(camelName)
  }

  getSizeToken(category: string, key: string): SizeToken | undefined {
    return this.sizeTokens.get(`${category}.${key}`)
  }

  getAllColorTokens(): ColorToken[] {
    return Array.from(this.colorTokens.values())
  }

  getAllSizeTokens(): SizeToken[] {
    return Array.from(this.sizeTokens.values())
  }

  getShadowToken(key: string): ShadowToken | undefined {
    return this.shadowTokens.get(key)
  }

  getAllShadowTokens(): ShadowToken[] {
    return Array.from(this.shadowTokens.values())
  }

  getColorByCssVar(cssVar: string, theme: 'light' | 'dark' = 'light'): string | undefined {
    return theme === 'dark' ? this.darkColor.get(cssVar) : this.lightColor.get(cssVar)
  }
}
