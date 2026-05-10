import clsx from 'clsx'
import { extractSprinkleProps } from '../../utils/util'
import { ListProps } from './types'
import { sprinkles } from '../../core/sprinkles.css'
import { listBase } from './navigation.css'
import { useMemo } from 'react'
import { NavigationListProvider } from '../../context/navigation/NavContext'

/**
 * Navigation List Component
 *
 * Container for Navigation.Item components.
 * Provides URL matching strategy context to child Items.
 *
 * @example
 * ```tsx
 * <Navigation.List>
 *   <Navigation.Item to="/">Today</Navigation.Item>
 *   <Navigation.Item to="/week">This Week</Navigation.Item>
 * </Navigation.List>
 * ```
 *
 * @example With startsWith matching (for nested routes)
 * ```tsx
 * <Navigation.List match="startsWith">
 *   <Navigation.Item to="/settings">Settings</Navigation.Item>
 * </Navigation.List>
 * ```
 */
export const List = ({ className, children, match = 'exact', ...rest }: ListProps) => {
  const [sprinkleProps, restProps] = extractSprinkleProps(rest)

  const listContextValue = useMemo(() => ({ match }), [match])

  return (
    <NavigationListProvider value={listContextValue}>
      <nav
        className={clsx([sprinkles(sprinkleProps), listBase, className])}
        aria-label="Main navigation"
        {...restProps}
      >
        <ul>{children}</ul>
      </nav>
    </NavigationListProvider>
  )
}
