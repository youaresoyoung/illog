import { relations, sql } from 'drizzle-orm'
import { index, primaryKey, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { tasks } from './task'

export const tagColorEnum = ['blue', 'green', 'yellow', 'purple', 'red', 'gray'] as const
export type TagColor = (typeof tagColorEnum)[number]

export const tags = sqliteTable(
  'tag',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    color: text('color', { enum: tagColorEnum }).notNull().default('gray'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text('updated_at'),
    deletedAt: text('deleted_at')
  },
  (table) => ({
    nameIdx: uniqueIndex('tag_name_idx').on(table.name),
    deletedAtIdx: index('tag_deleted_at_idx').on(table.deletedAt)
  })
)

export const tagsRelations = relations(tags, ({ many }) => ({
  taskTags: many(taskTags)
}))

export const taskTags = sqliteTable(
  'task_tag',
  {
    taskId: text('task_id')
      .notNull()
      .references(() => tasks.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' })
  },
  (table) => ({
    pk: primaryKey({ columns: [table.taskId, table.tagId] })
  })
)

export const taskTagsRelations = relations(taskTags, ({ one }) => ({
  task: one(tasks, {
    fields: [taskTags.taskId],
    references: [tasks.id]
  }),
  tag: one(tags, {
    fields: [taskTags.tagId],
    references: [tags.id]
  })
}))
