import { Box } from '../Box'
import { containerBase } from './navigation.css'
import { ContainerProps } from './types'
import clsx from 'clsx'

export const Container = ({ className, children }: ContainerProps) => {
  return (
    <Box
      as="aside"
      role="navigation"
      p="600"
      display="flex"
      flexDirection="column"
      backgroundColor="backgroundDefaultDefault"
      className={clsx([containerBase, className])}
    >
      {children}
    </Box>
  )
}
