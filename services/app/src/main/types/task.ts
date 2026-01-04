import { Tag, Task, TaskStatus } from '../database/schema'
import { ISODate, UUID } from './common'

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

export interface TaskWithTags extends Task {
  tags: Tag[]
}

export type OmittedTask = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'done_at' | 'deleted_at'>

export type TaskFilters = {
  status?: TaskStatus
  projectId?: string
  tagIds?: string[]
  dateFrom?: string
  dateTo?: string
  search?: string
  timeZone?: string
}
