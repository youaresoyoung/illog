// import { Link } from 'react-router'
import { ItemProps } from './types'
// import { useNavContext } from '../../hooks/useNavigation'
import { itemBase, itemLinkBase } from './navigation.css'
import { Link } from 'react-router'
import { Icon } from '../Icon'

export const Item = ({ id, iconName, label, to, children, disabled }: ItemProps) => {
  //   const { activeId, updateActiveId } = useNavContext()
  //   const isActive = activeId === id

  //   const handleClick = (e: React.MouseEvent) => {
  //     if (disabled) {
  //       e.preventDefault()
  //       return
  //     }
  //     updateActiveId(id)
  //   }

  return (
    <li className={itemBase}>
      <Link
        id={id}
        className={itemLinkBase}
        to={to}
        aria-disabled={disabled}
        //   onClick={handleClick}
      >
        {iconName && <Icon name={iconName} />}
        {label}
        {children}
      </Link>
    </li>
  )
}
