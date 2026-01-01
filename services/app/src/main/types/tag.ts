import { Color, ISODate, UUID } from './common'

export const MAX_TAG_LENGTH = 3
export interface Tag {
  id: UUID
  name: string
  color: Color
  created_at: ISODate
  updated_at: ISODate
  deleted_at: ISODate
}

export type OmittedTag = Omit<Tag, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>
