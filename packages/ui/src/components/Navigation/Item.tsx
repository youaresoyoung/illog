// import { Link } from 'react-router'
import { ItemProps } from './types'
// import { useNavContext } from '../../hooks/useNavigation'
import { itemBase, itemLinkBase, itemLinkRecipe } from './navigation.css'
import { Link } from 'react-router'
import { Icon } from '../Icon'
import clsx from 'clsx'

export const Item = ({
  id,
  iconName,
  label,
  to,
  isActive,
  onClick = () => {},
  children,
  disabled
}: ItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault()
      return
    }
    onClick()
  }

  return (
    <li className={itemBase} onClick={handleClick}>
      <Link
        id={id}
        className={clsx([itemLinkBase, itemLinkRecipe({ isActive })])}
        to={to}
        aria-disabled={disabled}
      >
        {iconName && <Icon name={iconName} />}
        {label}
        {children}
      </Link>
    </li>
  )
}
