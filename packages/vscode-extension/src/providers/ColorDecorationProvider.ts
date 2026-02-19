import {
  Color,
  ColorInformation,
  ColorPresentation,
  DocumentColorProvider,
  ProviderResult,
  Range,
  TextDocument
} from 'vscode'
import { TokenRegistry } from '../registry/TokenRegistry'
import { parseColor } from '../utils/color'

export class ColorDecorationProvider implements DocumentColorProvider {
  constructor(private registry: TokenRegistry) {}

  provideDocumentColors(document: TextDocument): ProviderResult<ColorInformation[]> {
    const colors: ColorInformation[] = []
    const text = document.getText()

    // Match: backgroundColors.xxx, textColors.xxx, borderColors.xxx, iconColors.xxx
    const regex = /(?:backgroundColors|textColors|borderColors|iconColors)\.(\w+)/g
    let match
    while ((match = regex.exec(text)) !== null) {
      const tokenName = match[1]

      const token = this.registry.getColorToken(tokenName)
      if (!token || !token.lightValue) {
        continue
      }

      const parsed = parseColor(token.lightValue)
      if (!parsed) continue

      const startPos = document.positionAt(match.index)
      const endPos = document.positionAt(match.index + match[0].length)
      const range = new Range(startPos, endPos)

      colors.push(new ColorInformation(range, new Color(parsed.r, parsed.g, parsed.b, parsed.a)))
    }

    return colors
  }

  provideColorPresentations(
    color: Color,
    context: { readonly document: TextDocument; readonly range: Range }
  ): ProviderResult<ColorPresentation[]> {
    const originalText = context.document.getText(context.range)
    return [new ColorPresentation(originalText)]
  }
}
