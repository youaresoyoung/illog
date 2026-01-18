import { CodeNode, CodeHighlightNode } from '@lexical/code'
import { LinkNode, AutoLinkNode } from '@lexical/link'
import { ListNode, ListItemNode } from '@lexical/list'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { Klass, LexicalNode } from 'lexical'

export const EDITOR_NODES: Klass<LexicalNode>[] = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode,
  AutoLinkNode
]

export const EDITOR_THEME = {
  paragraph: 'editor__paragraph',
  heading: {
    h1: 'editor__heading-h1',
    h2: 'editor__heading-h2',
    h3: 'editor__heading-h3',
    h4: 'editor__heading-h4',
    h5: 'editor__heading-h5',
    h6: 'editor__heading-h6'
  },
  list: {
    nested: {
      listitem: 'editor__nested-listitem'
    },
    ol: 'editor__list-ol',
    ul: 'editor__list-ul',
    listitem: 'editor__listItem',
    checklist: 'editor__checklist',
    listitemChecked: 'editor__listItem-checked',
    listitemUnchecked: 'editor__listItem-unchecked'
  },
  hashtag: 'editor__hashtag',
  image: 'editor__image',
  link: 'editor__link',
  text: {
    bold: 'editor__text-bold',
    code: 'editor__text-code',
    italic: 'editor__text-italic',
    strikethrough: 'editor__text-strikethrough',
    subscript: 'editor__text-subscript',
    superscript: 'editor__text-superscript',
    underline: 'editor__text-underline',
    underlineStrikethrough: 'editor__text-underline-strikethrough'
  },
  quote: 'editor__quote',
  code: 'editor__code',
  codeHighlight: {
    atrule: 'editor__token-attr',
    attr: 'editor__token-attr',
    boolean: 'editor__token-property',
    builtin: 'editor__token-selector',
    cdata: 'editor__token-comment',
    char: 'editor__token-selector',
    class: 'editor__token-function',
    'class-name': 'editor__token-function',
    comment: 'editor__token-comment',
    constant: 'editor__token-property',
    deleted: 'editor__token-property',
    doctype: 'editor__token-comment',
    entity: 'editor__token-operator',
    function: 'editor__token-function',
    important: 'editor__token-variable',
    inserted: 'editor__token-selector',
    keyword: 'editor__token-attr',
    namespace: 'editor__token-variable',
    number: 'editor__token-property',
    operator: 'editor__token-operator',
    prolog: 'editor__token-comment',
    property: 'editor__token-property',
    punctuation: 'editor__token-punctuation',
    regex: 'editor__token-variable',
    selector: 'editor__token-selector',
    string: 'editor__token-selector',
    symbol: 'editor__token-property',
    tag: 'editor__token-property',
    url: 'editor__token-operator',
    variable: 'editor__token-variable'
  }
}

type EditorConfigOptions = {
  namespace?: string
  onError?: (error: Error) => void
}

export function createEditorConfig(options: EditorConfigOptions = {}) {
  const { namespace = 'NoteEditor', onError } = options

  return {
    namespace,
    nodes: EDITOR_NODES,
    theme: EDITOR_THEME,
    onError: onError ?? ((error: Error) => console.error('Lexical Error:', error))
  }
}
