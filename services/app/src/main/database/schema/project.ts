import { relations, sql } from 'drizzle-orm'
import { sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { tasks } from './task'
import { randomUUID } from 'crypto'

export const projectColorEnum = ['blue', 'green', 'yellow', 'purple', 'red', 'gray'] as const
export type ProjectColor = (typeof projectColorEnum)[number]

export const projects = sqliteTable(
  'project',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID())
      .notNull(),
    name: text('name').notNull(),
    color: text('color', { enum: projectColorEnum }).notNull().default('blue'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text('updated_at'),
    deletedAt: text('deleted_at')
  },
  (table) => ({
    nameIdx: uniqueIndex('project_name_idx').on(table.name)
  })
)

export const projectsRelations = relations(projects, ({ many }) => ({
  tasks: many(tasks)
}))
