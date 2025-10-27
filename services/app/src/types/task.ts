import { Status, Timestamp, UUID } from './common'
import { Tag } from './tag'

export interface TaskNote {
  task_id: UUID
  content: string
  updated_at: Timestamp
}

export interface TaskTag {
  task_id: UUID
  tag_id: UUID
}

export interface Task {
  id: UUID
  title: string
  description: string
  status: Status
  project_id: UUID | null
  end_time?: Timestamp
  created_at: Timestamp
  updated_at: Timestamp
  done_at?: Timestamp
  deleted_at?: Timestamp
}

export interface TaskWithTags extends Task {
  tags: Tag[]
}

export type OmittedTask = Omit<
  Task,
  'id' | 'end_time' | 'created_at' | 'updated_at' | 'done_at' | 'deleted_at'
>
