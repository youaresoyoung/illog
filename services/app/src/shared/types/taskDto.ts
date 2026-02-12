import type { TaskStatus } from './common'
import type { Task, TaskWithTags } from './entities'

export type CreateTaskRequest = void

export interface UpdateTaskRequest {
  title?: string
  description?: string | null
  status?: TaskStatus
  projectId?: string | null
  taskTypeId?: string | null
  taskSubtypeId?: string | null
  startTime?: Date | string | null
  endTime?: Date | string | null
}

export interface TaskFilterParams {
  status?: TaskStatus
  projectId?: string
  taskTypeId?: string
  taskSubtypeId?: string
  startTime?: string
  endTime?: string
  search?: string
}

export type TaskResponse = Task

export type TaskWithTagsResponse = TaskWithTags

export type TaskListResponse = TaskWithTags[]
