import { taskNotes } from './note'
import { projects } from './project'
import { tags } from './tag'
import { tasks } from './task'
import { taskReflections } from './taskReflection'

export * from './note'
export * from './project'
export * from './tag'
export * from './task'
export * from './taskTag'
export * from './taskReflection'

export type Task = typeof tasks.$inferSelect
export type InsertTask = typeof tasks.$inferInsert
export type Tag = typeof tags.$inferSelect
export type Project = typeof projects.$inferSelect
export type TaskNote = typeof taskNotes.$inferSelect
export type TaskReflection = typeof taskReflections.$inferSelect
