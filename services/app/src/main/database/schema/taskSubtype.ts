import { randomUUID } from 'crypto'
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import { taskTypes } from './taskType'
import { relations, sql } from 'drizzle-orm'

export const taskSubtypeColor = ['blue', 'green', 'yellow', 'purple', 'red', 'gray'] as const
export type TaskSubtypeColor = (typeof taskSubtypeColor)[number]

export const taskSubtypes = sqliteTable(
  'task_subtype',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => randomUUID()),
    taskTypeId: text('task_type_id')
      .notNull()
      .references(() => taskTypes.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    color: text('color', { enum: taskSubtypeColor }).notNull().default('blue'),
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
    taskTypeIdx: index('task_subtype_task_type_idx').on(table.taskTypeId),
    uniqueNamePerType: uniqueIndex('task_subtype_unique_name_per_type_idx').on(
      table.taskTypeId,
      table.name
    ),
    deletedAtIdx: index('task_subtype_deleted_at_idx').on(table.deletedAt)
  })
)

export const taskSubtypeRelations = relations(taskSubtypes, ({ one }) => ({
  taskType: one(taskTypes, {
    fields: [taskSubtypes.taskTypeId],
    references: [taskTypes.id]
  })
}))
