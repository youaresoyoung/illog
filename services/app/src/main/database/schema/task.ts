import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'
import { projects } from './project'
import { taskNotes } from './note'
import { taskTags } from './taskTag'
import { randomUUID } from 'crypto'
import { taskReflections } from './taskReflection'
import { taskTypes } from './taskType'
import { taskSubtypes } from './taskSubtype'

export const taskStatusEnum = ['todo', 'in_progress', 'done'] as const
export type TaskStatus = (typeof taskStatusEnum)[number]

export const tasks = sqliteTable(
  'task',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => randomUUID()),
    title: text('title').notNull().default('Untitled'),
    description: text('description'),
    status: text('status', { enum: taskStatusEnum }).notNull().default('todo'),
    projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    taskTypeId: text('task_type_id').references(() => taskTypes.id, { onDelete: 'set null' }),
    taskSubtypeId: text('task_subtype_id').references(() => taskSubtypes.id, {
      onDelete: 'set null'
    }),
    endTime: integer('end_time', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => sql`(unixepoch())`),
    doneAt: integer('done_at', { mode: 'timestamp' }),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
    startTime: integer('started_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`)
  },
  (table) => ({
    statusIdx: index('task_status_idx').on(table.status),
    deletedAtIdx: index('task_deleted_at_idx').on(table.deletedAt),
    statusDeletedIdx: index('task_status_deleted_idx').on(table.status, table.deletedAt),
    createdAtIdx: index('task_created_at_idx').on(table.createdAt),
    startTimeIdx: index('task_start_at_idx').on(table.startTime),
    taskTypeIdx: index('task_type_id_idx').on(table.taskTypeId),
    taskSubtypeIdx: index('task_subtype_id_idx').on(table.taskSubtypeId)
  })
)

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id]
  }),
  taskType: one(taskTypes, {
    fields: [tasks.taskTypeId],
    references: [taskTypes.id]
  }),
  taskSubtype: one(taskSubtypes, {
    fields: [tasks.taskSubtypeId],
    references: [taskSubtypes.id]
  }),
  taskTags: many(taskTags),
  note: one(taskNotes, {
    fields: [tasks.id],
    references: [taskNotes.taskId]
  }),
  reflection: one(taskReflections, {
    fields: [tasks.id],
    references: [taskReflections.taskId]
  })
}))
