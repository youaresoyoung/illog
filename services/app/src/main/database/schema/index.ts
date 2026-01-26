import { taskNotes } from './note'
import { projects } from './project'
import { tags } from './tag'
import { tasks } from './task'
import { taskReflections } from './taskReflection'
import { taskSubtypes } from './taskSubtype'
import { taskTypes } from './taskType'
import { weeklyReflections } from './weeklyReflection'

export * from './note'
export * from './project'
export * from './tag'
export * from './task'
export * from './taskTag'
export * from './taskReflection'
export * from './weeklyReflection'
export * from './taskType'
export * from './taskSubtype'

export type Task = typeof tasks.$inferSelect
export type InsertTask = typeof tasks.$inferInsert

export type Tag = typeof tags.$inferSelect
export type InsertTag = typeof tags.$inferInsert

export type Project = typeof projects.$inferSelect
export type InsertProject = typeof projects.$inferInsert

export type TaskNote = typeof taskNotes.$inferSelect
export type TaskReflection = typeof taskReflections.$inferSelect

export type WeeklyReflection = typeof weeklyReflections.$inferSelect
export type InsertWeeklyReflection = typeof weeklyReflections.$inferInsert

export type TaskType = typeof taskTypes.$inferSelect
export type InsertTaskType = typeof taskTypes.$inferInsert

export type TaskSubtype = typeof taskSubtypes.$inferSelect
export type InsertTaskSubtype = typeof taskSubtypes.$inferInsert
