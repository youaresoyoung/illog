import { Color, Timestamp, UUID } from './common'

export interface Project {
  id: UUID
  name: string
  color: Color
  created_at: Timestamp
  updated_at: Timestamp
}
