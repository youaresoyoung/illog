import Database from 'better-sqlite3'
import { app } from 'electron'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { isDev } from '../utils/utils'

export function openDB() {
  const dbPath = join(app.getPath('userData'), 'illog.db')

  const db = new Database(dbPath)

  if (!existsSync(dbPath)) {
    const schemaPath = isDev()
      ? join(app.getAppPath(), 'src/main/database/schema.sql')
      : join(process.resourcesPath, 'schema.sql')

    const schema = readFileSync(schemaPath, 'utf8')
    db.exec(schema)
  }

  return db
}
