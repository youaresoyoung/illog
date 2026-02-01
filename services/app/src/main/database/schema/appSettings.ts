import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const appSettings = sqliteTable('app_setting', {
  key: text('key').primaryKey().notNull(),
  value: text('value').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
})
