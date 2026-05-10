import { ReactNode } from 'react'
import type { IconName } from '../Icon'

export type ToggleGroupItem<T extends string = string> = {
  value: T
  icon?: IconName
  label?: string
  ariaLabel?: string
}

export type ToggleGroupProps = {
  children: ReactNode
}

export type ToggleItemProps = {
  item: ToggleGroupItem
  index: number
  value: string
  size?: 'small' | 'medium'
  onChange: (value: string) => void
}
