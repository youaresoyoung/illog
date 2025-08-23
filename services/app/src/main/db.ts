import Database from 'better-sqlite3'
import { app } from 'electron'
import { existsSync, readFileSync, unlinkSync } from 'fs'
import { join } from 'path'

export function openDB() {
  const dbPath = join(app.getPath('userData'), 'illog.db')

  const db = new Database(dbPath)

  // after test remove this line
  // if (existsSync(dbPath)) {
  //   unlinkSync(dbPath)
  // }

  if (!existsSync(dbPath)) {
    const schema = readFileSync(join(app.getAppPath(), 'src/main/database/schema.sql'), 'utf8')
    db.exec(schema)
  }

  return db
}
