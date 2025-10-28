import { readFileSync } from 'fs'
import { join } from 'path'
import { isDev } from '../../utils/utils'
import { app } from 'electron'

const migrationsPath = isDev()
  ? join(app.getAppPath(), 'src/main/database/migrations')
  : join(process.resourcesPath, 'migrations')

const getMigrationFiles = (fileName: string) => {
  return readFileSync(join(migrationsPath, `${fileName}.sql`), 'utf8')
}

export const migrations = [
  {
    version: 1,
    up: getMigrationFiles('001_initial_schema')
  },
  {
    version: 2,
    up: getMigrationFiles('002_add_description_to_task')
  },
  {
    version: 3,
    up: getMigrationFiles('003_set_timer_columns')
  }
]
