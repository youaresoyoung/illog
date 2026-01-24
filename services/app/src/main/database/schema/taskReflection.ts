import { randomUUID } from 'crypto'
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { tasks } from './task'
import { relations, sql } from 'drizzle-orm'

export const taskReflections = sqliteTable(
  'task_reflection',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID())
      .notNull(),
    taskId: text('task_id')
      .notNull()
      .unique()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    originalNoteHash: text('original_note_hash'),
    modelName: text('model_name'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(datetime('now'))`)
  },
  (table) => ({
    taskIdIdx: index('task_reflection_task_id_idx').on(table.taskId)
  })
)

export const taskReflectionsRelations = relations(taskReflections, ({ one }) => ({
  task: one(tasks, {
    fields: [taskReflections.taskId],
    references: [tasks.id]
  })
}))
