import { Color, Timestamp, UUID } from './common'

export interface Tag {
  id: UUID
  name: string
  color: Color
  created_at: Timestamp
  updated_at: Timestamp
  deleted_at: Timestamp
}

export type OmittedTag = Omit<Tag, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
