import { TokenHoverProvider } from './providers/TokenHoverProvider'
import { SprinklesCompletionProvider } from './providers/SprinklesCompletionProvider'
import { ColorDecorationProvider } from './providers/ColorDecorationProvider'
import { TokenRegistry } from './registry/TokenRegistry'
import { DocumentSelector, ExtensionContext, languages, window, workspace } from 'vscode'

let registry: TokenRegistry | undefined
const outputChannel = window.createOutputChannel('illog Design Tokens')

function log(message: string) {
  outputChannel.appendLine(`[illog] ${message}`)
  console.log(`[illog] ${message}`)
}

log('module loaded')

export function activate(context: ExtensionContext) {
  const workspaceRoot = findWorkspaceRoot()
  if (!workspaceRoot) {
    return
  }

  registry = new TokenRegistry(workspaceRoot)
  registry.load()

  const selector: DocumentSelector = [
    { language: 'typescript', scheme: 'file' },
    {
      language: 'typescriptreact',
      scheme: 'file'
    }
  ]

  context.subscriptions.push(
    languages.registerHoverProvider(selector, new TokenHoverProvider(registry))
  )

  context.subscriptions.push(
    languages.registerColorProvider(selector, new ColorDecorationProvider(registry))
  )

  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      selector,
      new SprinklesCompletionProvider(registry),
      '"',
      "'",
      '{'
    )
  )
}

export function findWorkspaceRoot(): string | undefined {
  const folders = workspace.workspaceFolders
  if (!folders || folders.length === 0) {
    return undefined
  }
  return folders[0].uri.fsPath
}
