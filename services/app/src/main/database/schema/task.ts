import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { relations, sql } from 'drizzle-orm'
import { projects } from './project'
import { taskNotes } from './note'
import { taskTags } from './taskTag'
import { randomUUID } from 'crypto'
import { taskReflections } from './taskReflection'

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
  },
  (table) => ({
    statusIdx: index('task_status_idx').on(table.status),
    deletedAtIdx: index('task_deleted_at_idx').on(table.deletedAt),
    statusDeletedIdx: index('task_status_deleted_idx').on(table.status, table.deletedAt),
    createdAtIdx: index('task_created_at_idx').on(table.createdAt),
    startTimeIdx: index('task_start_at_idx').on(table.startTime)
  })
)

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id]
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
