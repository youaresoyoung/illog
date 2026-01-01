import { ISODate, Status, UUID } from './common'
import { Tag } from './tag'

export interface TaskNote {
  task_id: UUID
  content: string
  updated_at: ISODate
}

export interface TaskReflection {
  id: UUID
  task_id: UUID
  content: string
  original_note_hash?: string
  model_name?: string
  created_at: ISODate
  updated_at: ISODate
}

export type CreateTaskReflectionParams = Omit<
  TaskReflection,
  'id' | 'model_name' | 'id' | 'created_at' | 'updated_at'
>

export type UpdateTaskReflectionParams = Pick<
  TaskReflection,
  'id' | 'task_id' | 'content' | 'original_note_hash'
> &
  Partial<Omit<TaskReflection, 'model_name' | 'created_at' | 'updated_at'>>

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
  start_at?: ISODate
  end_at?: ISODate
  created_at: ISODate
  updated_at: ISODate
  done_at?: ISODate // business logic (task done)
  deleted_at?: ISODate
}

export interface TaskWithTags extends Task {
  tags: Tag[]
}

export type OmittedTask = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'done_at' | 'deleted_at'>

export type TaskFilters = {
  status?: Status
  project_id?: string
  tag_ids?: string[]
  date_from?: string
  date_to?: string
  search?: string
}

export type TaskSortBy = 'created_at' | 'updated_at' | 'done_at' | 'title'

export type TaskSortOrder = 'asc' | 'desc'
