import { Root } from './Root'
import { Trigger } from './Trigger'
import { Content } from './Content'
import { Search } from './Search'
import { List } from './List'

export const TagSelector = {
  Root,
  Trigger,
  Content,
  Search,
  List
}

export { useTagSelectorContext } from './context'
export type { TagSelectorContextValue } from './context'
