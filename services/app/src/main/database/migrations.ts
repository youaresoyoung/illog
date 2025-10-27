import { readFileSync } from 'fs'
import { join } from 'path'
import { isDev } from '../../utils/utils'
import { app } from 'electron'

const migrationsPath = isDev()
  ? join(app.getAppPath(), 'src/main/database/migrations')
  : join(process.resourcesPath, 'migrations')

export const migrations = [
  {
    version: 1,
    up: readFileSync(join(migrationsPath, '001_initial_schema.sql'), 'utf8')
  },
  {
    version: 2,
    up: readFileSync(join(migrationsPath, '002_add_description_to_task.sql'), 'utf8')
  }
]
