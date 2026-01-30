import { HTMLAttributes, MouseEvent } from 'react'

export type BadgeColor = 'blue' | 'gray' | 'green' | 'purple' | 'red' | 'yellow'

export type BadgeItem = {
  id: string
  name: string
  color?: BadgeColor
  createdAt?: Date | string
  updatedAt?: Date | string | null
  deletedAt?: Date | string | null
}

export type OmittedBadgeItem = Omit<BadgeItem, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>

export type BadgeProps = {
  item: BadgeItem | OmittedBadgeItem
  addButtonVariant?: 'default' | 'error'
  isOpenedSelector?: boolean
  withoutIcon?: boolean
  openSelector?: (e: MouseEvent<HTMLButtonElement>) => void
  onRemove?: () => void
} & HTMLAttributes<HTMLSpanElement>
