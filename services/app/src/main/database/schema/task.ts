import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core'
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
      .$defaultFn(() => randomUUID())
      .notNull(),
    title: text('title').notNull().default('Untitled'),
    description: text('title'),
    status: text('status', { enum: taskStatusEnum }).notNull().default('todo'),
    projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
    endTime: text('end_time'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text('updated_at'),
    doneAt: text('done_at'),
    deletedAt: text('deleted_at'),
    startTime: text('started_at')
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
