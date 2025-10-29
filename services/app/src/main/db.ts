import Database from 'better-sqlite3'
import { app } from 'electron'
import { join } from 'path'
import { migrate } from '@blackglory/better-sqlite3-migrations'
import { migrations } from './database/migrations'

export function openDB() {
  const dbPath = join(app.getPath('userData'), 'illog.db')

  const db = new Database(dbPath)

  migrate(db, migrations)

  return db
}
