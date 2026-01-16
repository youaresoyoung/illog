import { Content } from './Content'
import { Root } from './Root'
import { Value } from './Value'
import { Viewport } from './Viewport'
import { Trigger } from './Trigger'
import { Item } from './Item'

export const BasicSelector = {
  Root,
  Trigger,
  Content,
  Viewport,
  Item,
  Value
}

export type {
  BasicSelectorContextValue,
  BasicSelectorRootProps,
  BasicSelectorContentProps,
  BasicSelectorViewportProps,
  BasicSelectorTriggerProps,
  BasicSelectorItemProps,
  BasicSelectorValueProps
} from './types'

export { useBasicSelectorContext } from './context'
