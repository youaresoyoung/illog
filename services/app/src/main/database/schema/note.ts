import { relations, sql } from 'drizzle-orm'
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { tasks } from './task'

export const taskNotes = sqliteTable('task_note', {
  taskId: text('task_id')
    .primaryKey()
    .references(() => tasks.id, { onDelete: 'cascade' }),
  content: text('content'),
  updatedAt: text('updated_at')
})

export const taskNotesRelations = relations(taskNotes, ({ one }) => ({
  task: one(tasks, {
    fields: [taskNotes.taskId],
    references: [tasks.id]
  })
}))

export const taskReflections = sqliteTable(
  'task_reflection',
  {
    id: text('id').primaryKey(),
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
