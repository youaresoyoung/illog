import { relations, sql } from 'drizzle-orm'
import { index, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { taskTags } from './taskTag'
import { randomUUID } from 'crypto'

export const tagColorEnum = ['blue', 'green', 'yellow', 'purple', 'red', 'gray'] as const
export type TagColor = (typeof tagColorEnum)[number]

export const tags = sqliteTable(
  'tag',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID())
      .notNull(),
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
