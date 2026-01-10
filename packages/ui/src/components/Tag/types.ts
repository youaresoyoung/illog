import { HTMLAttributes, MouseEvent } from 'react'

export type TagColor = 'blue' | 'gray' | 'green' | 'purple' | 'red' | 'yellow'

export type TagType = {
  id: string
  name: string
  color: TagColor
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export type OmittedTag = Omit<TagType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>

export type TagProps = {
  tag: TagType | OmittedTag
  addTagButtonVariant?: 'default' | 'error'
  openTagSelector?: (e: MouseEvent<HTMLButtonElement>) => void
  removeFromTask?: (id: string) => void
} & HTMLAttributes<HTMLSpanElement>
