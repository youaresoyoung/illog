import { HTMLAttributes } from 'react'

export type TagColor = 'blue' | 'gray' | 'green' | 'purple' | 'red' | 'yellow'

export type TagType = {
  id: string
  name: string
  color: TagColor
  created_at: string
  updated_at: string
  deleted_at: string
}

export type OmittedTag = Omit<TagType, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>

export type TagProps = {
  tag: TagType | OmittedTag
  isVisibleRemoveButton?: boolean
  onRemove?: (id: string) => void
} & HTMLAttributes<HTMLSpanElement>
