import { Color, ISODate, UUID } from './common'

export interface Project {
  id: UUID
  name: string
  color: Color
  created_at: ISODate
  updated_at: ISODate
}
