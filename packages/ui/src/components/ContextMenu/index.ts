import { Root } from './Root'
import { Trigger } from './Trigger'
import { Content } from './Content'
import { Item } from './Item'
import { SubRoot } from './Sub/SubRoot'
import { SubTrigger } from './Sub/SubTrigger'
import { SubContent } from './Sub/SubContent'

export const ContextMenu = {
  Root,
  Trigger,
  Content,
  Item,
  SubRoot,
  SubTrigger,
  SubContent
}

export { useContextMenuContext } from './context/context'

export type {
  ContextMenuContextValue,
  ContextMenuRootProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
  ContextMenuItemProps,
  ContextMenuSubContextValue,
  ContextMenuSubRootProps,
  ContextMenuSubTriggerProps,
  ContextMenuSubContentProps
} from './types'
