import { ItemProps } from './types'
import { itemBase, itemLinkBase, itemLinkRecipe } from './navigation.css'
import { Link } from 'react-router'
import { Icon } from '../Icon'
import clsx from 'clsx'
import { useNavigationContext } from '../../context/navigation/NavContext'

/**
 * Navigation Item Component
 *
 * Automatically syncs with Navigation.Root state.
 * Use `value` to identify this item.
 *
 * @example
 * ```tsx
 * <Navigation.Item value="today" to="/" iconName="calendar">
 *   Today
 * </Navigation.Item>
 * ```
 */
export const Item = ({
  value,
  iconName,
  to,
  onClick,
  children,
  disabled,
  'aria-label': ariaLabel
}: ItemProps) => {
  const { value: activeValue, onValueChange } = useNavigationContext()
  const isActive = activeValue === value

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    onValueChange(value)
    onClick?.(e)
  }

  return (
    <li className={itemBase}>
      <Link
        to={to}
        className={clsx([itemLinkBase, itemLinkRecipe({ isActive })])}
        aria-current={isActive ? 'page' : undefined}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        onClick={handleClick}
      >
        {iconName && <Icon name={iconName} aria-hidden="true" />}
        {children}
      </Link>
    </li>
  )
}
