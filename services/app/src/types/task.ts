import { Status, Timestamp, UUID } from './common'

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
  status: Status
  project_id: UUID | null
  end_time?: Timestamp
  created_at: Timestamp
  updated_at: Timestamp
  done_at?: Timestamp
  deleted_at?: Timestamp
}
