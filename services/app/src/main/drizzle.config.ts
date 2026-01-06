import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'
import { isDev } from '../utils/utils'
import { resolve } from 'path'

config({ path: resolve(__dirname, '../../.env') })

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
