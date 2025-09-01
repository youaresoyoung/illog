import { ReactNode } from 'react'
import { Sprinkles } from '../../core/sprinkles.css'
import { IconName } from '../Icon'

export type ContainerProps = {
  className?: string
  children: ReactNode
} & Sprinkles

export type ListProps = {
  className?: string
  children: ReactNode
} & Sprinkles

export type ItemProps = {
  id: string
  to: string
  iconName?: IconName
  label: string
  isActive?: boolean
  onClick?: () => void
  children?: ReactNode
  disabled?: boolean
} & Sprinkles
