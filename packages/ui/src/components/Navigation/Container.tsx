import { Box } from '../Box'
import { containerBase } from './navigation.css'
import { ContainerProps } from './types'
import clsx from 'clsx'

/**
 * Navigation Container Component
 *
 * Provides the sidebar layout wrapper for navigation.
 * Just a layout component - no state management.
 *
 * @example
 * ```tsx
 * <Navigation.Container>
 *   <Logo />
 *   <Navigation.List>
 *     <Navigation.Item to="/">Home</Navigation.Item>
 *   </Navigation.List>
 * </Navigation.Container>
 * ```
 */
export const Container = ({ className, children }: ContainerProps) => {
  return (
    <Box
      as="aside"
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
