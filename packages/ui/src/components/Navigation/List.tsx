import clsx from 'clsx'
import { extractSprinkleProps } from '../../utils/util'
import { ListProps } from './types'
import { sprinkles } from '../../core/sprinkles.css'
import { listBase } from './navigation.css'

export const List = ({ className, children, ...rest }: ListProps) => {
  const [sprinkleProps, restProps] = extractSprinkleProps(rest)

  return (
    <nav className={clsx([sprinkles(sprinkleProps), listBase, className])} {...restProps}>
      {children}
    </nav>
  )
}
