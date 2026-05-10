import { relations, sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { taskTags } from './taskTag'
import { randomUUID } from 'crypto'

export const tagColorEnum = ['blue', 'green', 'yellow', 'purple', 'red', 'gray'] as const
export type TagColor = (typeof tagColorEnum)[number]

export const tags = sqliteTable(
  'tag',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => randomUUID()),
    name: text('name').notNull().unique(),
    color: text('color', { enum: tagColorEnum }).notNull().default('gray'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`)
      .$onUpdate(() => sql`(unixepoch())`),
    deletedAt: integer('deleted_at', { mode: 'timestamp' })
  },
  (table) => ({
    nameIdx: uniqueIndex('tag_name_idx').on(table.name),
    deletedAtIdx: index('tag_deleted_at_idx').on(table.deletedAt)
  })
)

export const tagsRelations = relations(tags, ({ many }) => ({
  taskTags: many(taskTags)
}))
