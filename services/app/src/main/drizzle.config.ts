import { defineConfig } from 'drizzle-kit'
import { config, isDev } from '../config/env'

export default defineConfig({
  dialect: 'sqlite',
  schema: './database/schema/index.ts',
  out: './database/migrations',
  dbCredentials: {
    url: config.dbFilePath
  },
  verbose: !!isDev,
  strict: !isDev
})
