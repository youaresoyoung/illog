import Database from 'better-sqlite3'
import { app } from 'electron'
import { readFileSync } from 'fs'
import { join } from 'path'

export function openDB(dbPath: string) {
  const db = new Database(dbPath)

  const schema = readFileSync(join(app.getAppPath(), 'src/main/database/schema.sql'), 'utf8')

  db.exec(schema)
  return db
}
