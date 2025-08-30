import { ElementType } from 'react'
import { Box } from '../Box'
import { CardProps } from './types'
import { cardBase } from './Card.css'
import clsx from 'clsx'

export const Card = <T extends ElementType>({ onClick, className, children }: CardProps<T>) => {
  return (
    <Box
      as="li"
      display="flex"
      flexDirection="column"
      bg="backgroundDefaultDefault"
      p="600"
      rounded="200"
      shadow="100"
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={clsx([cardBase, className])}
    >
      {children}
    </Box>
  )
}
