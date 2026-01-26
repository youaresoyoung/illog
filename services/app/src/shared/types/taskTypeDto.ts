import { TaskSubtype, TaskType } from '../../main/database/schema'
import { TaskTypeColor } from './../../main/database/schema/taskType'

export interface CreateTaskTypeRequest {
  name: string
  color?: TaskTypeColor
}

export interface UpdateTaskTypeRequest {
  name?: string
  color?: TaskTypeColor
}

export interface CreateTaskSubtypeRequest {
  taskTypeId: string
  name: string
}

export interface UpdateTaskSubtypeRequest {
  name?: string
}

export type TaskTypeDto = TaskType

export type TaskTypesDto = TaskType[]

export type TaskTypeWithSubtypesDto = TaskType & {
  subtypes: TaskSubtype[]
}

export type TaskSubtypeDto = TaskSubtype

export type TaskSubtypesDto = TaskSubtype[]
