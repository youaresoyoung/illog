import clsx from 'clsx'
import { extractSprinkleProps } from '../../utils/util'
import { ListProps } from './types'
import { sprinkles } from '../../core/sprinkles.css'
import { listBase } from './navigation.css'

/**
 * Navigation List Component
 *
 * Container for Navigation.Item components.
 *
 * @example
 * ```tsx
 * <Navigation.List>
 *   <Navigation.Item value="today" to="/">Today</Navigation.Item>
 *   <Navigation.Item value="week" to="/week">This Week</Navigation.Item>
 * </Navigation.List>
 * ```
 */
export const List = ({ className, children, ...rest }: ListProps) => {
  const [sprinkleProps, restProps] = extractSprinkleProps(rest)

  return (
    <nav
      className={clsx([sprinkles(sprinkleProps), listBase, className])}
      aria-label="Main navigation"
      {...restProps}
    >
      {children}
    </nav>
  )
}
