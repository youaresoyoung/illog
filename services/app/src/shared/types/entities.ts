export type {
  Task,
  InsertTask,
  Tag,
  InsertTag,
  Project,
  TaskType,
  TaskSubtype
} from '../../main/database/schema'

import type { taskNotes, taskReflections, weeklyReflections } from '../../main/database/schema'
export type TaskNote = typeof taskNotes.$inferSelect
export type InsertTaskNote = typeof taskNotes.$inferInsert
export type TaskReflection = typeof taskReflections.$inferSelect
export type InsertTaskReflection = typeof taskReflections.$inferInsert
export type WeeklyReflection = typeof weeklyReflections.$inferSelect
export type InsertWeeklyReflection = typeof weeklyReflections.$inferInsert

import type { Tag, Task, Project, TaskType, TaskSubtype } from '../../main/database/schema'

export interface TaskWithTags extends Task {
  tags: Pick<Tag, 'id' | 'name' | 'color'>[]
  project: Pick<Project, 'id' | 'name' | 'color'> | null
  taskType: Pick<TaskType, 'id' | 'name' | 'color'> | null
  taskSubtype: Pick<TaskSubtype, 'id' | 'name'> | null
}

export interface TaskWithDetails extends TaskWithTags {
  note: TaskNote | null
  reflection: TaskReflection | null
}
