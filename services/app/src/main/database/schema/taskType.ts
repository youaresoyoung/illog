import { randomUUID } from 'crypto'
import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const taskTypeColor = ['blue', 'green', 'yellow', 'purple', 'red', 'gray'] as const
export type TaskTypeColor = (typeof taskTypeColor)[number]

export const taskTypes = sqliteTable(
  'task_type',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => randomUUID()),
    name: text('name').notNull(),
    color: text('color', { enum: taskTypeColor }).notNull().default('blue'),
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
    nameIdx: uniqueIndex('task_type_name_idx').on(table.name),
    deletedAtIdx: index('task_type_deleted_at_idx').on(table.deletedAt)
  })
)
