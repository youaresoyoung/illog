import clsx from 'clsx'
import { splitSprinkleProps } from '../../utils/util'
import { ListProps } from './types'
import { sprinkles } from '../../core/sprinkles.css'
import { listBase } from './navigation.css'

export const List = ({ className, children, ...rest }: ListProps) => {
  const [sprinkleProps, restProps] = splitSprinkleProps(rest)

  return (
    <nav className={clsx([sprinkles(sprinkleProps), listBase, className])} {...restProps}>
      {children}
    </nav>
  )
}
