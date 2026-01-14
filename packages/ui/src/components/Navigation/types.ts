import { ReactNode } from 'react'
import { Sprinkles } from '../../core/sprinkles.css'
import { IconName } from '../Icon'

export type RootProps<T extends string = string> = {
  children: ReactNode
  /**
   * Controlled value - current active navigation item
   */
  value?: T
  /**
   * Controlled change handler
   */
  onValueChange?: (value: T) => void
  /**
   * Uncontrolled default value
   */
  defaultValue?: T
}

export type ContainerProps = {
  className?: string
  children: ReactNode
} & Sprinkles

export type ListProps = {
  className?: string
  children: ReactNode
} & Sprinkles

export type ItemProps = {
  /**
   * Unique identifier for this navigation item.
   * Used to determine active state.
   */
  value: string
  /**
   * Navigation destination
   */
  to: string
  /**
   * Optional icon name
   */
  iconName?: IconName
  /**
   * Item content (label)
   */
  children: ReactNode
  /**
   * Click handler (optional)
   */
  onClick?: (e: React.MouseEvent) => void
  /**
   * Disabled state
   */
  disabled?: boolean
  /**
   * Accessible label
   */
  'aria-label'?: string
}
