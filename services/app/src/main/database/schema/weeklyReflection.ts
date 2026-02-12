import { randomUUID } from 'crypto'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

/**
 * @weekId Week identifier: ISO week string (e.g., "2024-W01")
 * @accomplishments Key Accomplishments (JSON array of { id, text, completed })
 * @improvements Areas for Improvement (JSON array of strings)
 * @nextWeekFocus Next Week Focus (JSON array of tag IDs)
 */
export const weeklyReflections = sqliteTable(
  'weekly_reflection',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID())
      .notNull(),
    weekId: text('week_id').notNull().unique(),
    accomplishments: text('accomplishments').notNull().default('[]'),
    improvements: text('improvements').notNull().default('[]'),
    nextWeekFocus: text('next_week_focus').notNull().default('[]'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`)
  },
  (table) => ({
    weekIdIdx: index('weekly_reflection_week_id_idx').on(table.weekId)
  })
)
