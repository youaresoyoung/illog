import { Root } from './Root'
import { Trigger } from './Trigger'
import { Content } from './Content'
import { Search } from './Search'
import { List } from './List'

export const BadgeSelector = {
  Root,
  Trigger,
  Content,
  Search,
  List
}

export { useBadgeSelectorContext } from './context'
export type { BadgeSelectorContextValue } from './context'
