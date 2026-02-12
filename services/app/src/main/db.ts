import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './database/schema'
import { seedDefaultTaskTypes } from './database/seed'
import { config } from '../config/env'

export function openDB() {
  const dbPath = join(app.getPath('userData'), config.dbFileName)
  const sqlite = new Database(dbPath)
  const db = drizzle(sqlite, { schema })

  migrate(db, { migrationsFolder: join(__dirname, './database/migrations') })
  seedDefaultTaskTypes(db)

  return { db }
}
