import { ItemProps, ItemRenderProps } from './types'
import { itemBase, itemLinkBase, itemLinkRecipe } from './navigation.css'
import { NavLink } from 'react-router'
import { Icon } from '../Icon'
import clsx from 'clsx'
import { useNavigationListContext } from '../../context/navigation/NavContext'

/**
 * Navigation Item Component
 *
 * Works like React Router's NavLink - automatically detects active state from URL.
 * Supports render props for className, style, and children.
 *
 * @example Basic usage
 * ```tsx
 * <Navigation.Item to="/" iconName="calendar">Today</Navigation.Item>
 * ```
 *
 * @example With render prop className
 * ```tsx
 * <Navigation.Item
 *   to="/settings"
 *   className={({ isActive }) => isActive ? 'bg-blue-500' : 'bg-gray-100'}
 * >
 *   Settings
 * </Navigation.Item>
 * ```
 *
 * @example With render prop children
 * ```tsx
 * <Navigation.Item to="/inbox">
 *   {({ isActive }) => (
 *     <>
 *       <Icon name="inbox" />
 *       Inbox
 *       {isActive && <Badge count={3} />}
 *     </>
 *   )}
 * </Navigation.Item>
 * ```
 */
export const Item = ({
  iconName,
  to,
  onClick,
  children,
  className,
  style,
  disabled,
  'aria-label': ariaLabel,
  match: matchProp,
  end
}: ItemProps) => {
  const listContext = useNavigationListContext()
  const matchStrategy = matchProp ?? listContext.match ?? 'exact'

  const shouldEnd = end ?? matchStrategy === 'exact'

  return (
    <li className={itemBase}>
      <NavLink
        to={to}
        end={shouldEnd}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        onClick={(e) => {
          if (disabled) {
            e.preventDefault()
            return
          }
          onClick?.(e)
        }}
        className={({ isActive, isPending }) => {
          const renderProps: ItemRenderProps = { isActive, isPending }
          const customClass = typeof className === 'function' ? className(renderProps) : className
          return clsx([itemLinkBase, itemLinkRecipe({ isActive }), customClass])
        }}
        style={({ isActive, isPending }) => {
          if (!style) return undefined
          const renderProps: ItemRenderProps = { isActive, isPending }
          return typeof style === 'function' ? style(renderProps) : style
        }}
      >
        {({ isActive, isPending }) => {
          const renderProps: ItemRenderProps = { isActive, isPending }
          if (typeof children === 'function') {
            return children(renderProps)
          }

          return (
            <>
              {iconName && <Icon name={iconName} aria-hidden="true" />}
              {children}
            </>
          )
        }}
      </NavLink>
    </li>
  )
}
