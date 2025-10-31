import { Status, Timestamp, UUID } from './common'
import { Tag } from './tag'

export interface TaskNote {
  task_id: UUID
  content: string
  updated_at: Timestamp
}

export interface TaskReflection {
  id: UUID
  task_id: UUID
  content: string
  original_note_hash?: string
  model_name?: string
  created_at: Timestamp
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
  timer_start?: Timestamp
  timer_end?: Timestamp
  created_at: Timestamp
  updated_at: Timestamp
  done_at?: Timestamp // business logic (task done)
  deleted_at?: Timestamp
}

export interface TaskWithTags extends Task {
  tags: Tag[]
}

export type OmittedTask = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'done_at' | 'deleted_at'>
