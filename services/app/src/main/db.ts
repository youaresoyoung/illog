import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './database/schema'

export function openDB() {
  if (!process.env.DB_FILE_NAME) {
    throw Error('DB_FILE_NAME is not defined in environment variables')
  }

  const dbPath = join(app.getPath('userData'), process.env.DB_FILE_NAME)
  const sqlite = new Database(dbPath)
  const db = drizzle(sqlite, { schema })

  migrate(db, { migrationsFolder: join(__dirname, './database/migrations') })

  return { db }
}
