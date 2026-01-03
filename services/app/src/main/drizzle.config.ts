import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import { isDev } from '../utils/utils'

export default defineConfig({
  dialect: 'sqlite',
  schema: './database/schema/index.ts',
  out: './database/migrations',
  dbCredentials: {
    url: process.env.DB_FILE_PATH!
  },
  verbose: !!isDev,
  strict: !isDev
})
