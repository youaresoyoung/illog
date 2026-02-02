import dotenv from 'dotenv'
import { existsSync, readFileSync } from 'fs'
import { dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

const moduleFullPath = fileURLToPath(import.meta.url)
const moduleDirname = dirname(moduleFullPath)
const isPackaged = moduleFullPath.includes('app.asar')

export const isDev = !isPackaged && process.env.NODE_ENV !== 'production'

const computeSearchRoots = (): string[] => {
  const roots = new Set<string>()
  roots.add(process.cwd())

  try {
    let current = moduleDirname
    for (let i = 0; i < 3; i++) {
      roots.add(current)
      const parent = dirname(current)
      if (parent === current) break
      current = parent
    }
  } catch (e) {
    console.warn('[env] Failed to compute search roots:', e)
  }

  if (process.resourcesPath) {
    roots.add(process.resourcesPath)
    roots.add(join(process.resourcesPath, 'app'))
  }

  return Array.from(roots)
}

const ENV_FILES = [
  `.env.${process.env.NODE_ENV}.local`,
  `.env.${process.env.NODE_ENV}`,
  '.env.local',
  '.env'
]

const parseEnvFile = (fullPath: string, target: Record<string, string>): void => {
  const lines = readFileSync(fullPath, 'utf-8').split(/\r?\n/)

  for (const raw of lines) {
    const line = raw.trim()
    if (!line || line.startsWith('#')) continue

    const idx = line.indexOf('=')
    if (idx === -1) continue

    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (!(key in target)) {
      target[key] = value
    }
  }
}

const loadEnvFiles = (): Record<string, string> => {
  const env: Record<string, string> = {}
  const roots = computeSearchRoots()

  for (const root of roots) {
    for (const file of ENV_FILES) {
      const fullPath = join(root, file)
      if (existsSync(fullPath)) {
        try {
          parseEnvFile(fullPath, env)
        } catch (e) {
          console.warn(`[env] Failed to parse ${fullPath}:`, e)
        }
      }
    }
  }

  return env
}

const fileEnv = loadEnvFiles()

if (isDev) {
  try {
    const result = dotenv.config({ path: resolve(process.cwd(), '.env.development.local') })
    if (result.parsed) {
      Object.assign(fileEnv, result.parsed)
    }
  } catch (e) {
    console.warn('[env] dotenv.config failed:', e)
  }
}

const getEnvValue = (key: string): string | undefined => {
  return process.env[key] || fileEnv[key]
}

const getRequiredEnv = (key: string): string => {
  const value = getEnvValue(key)
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value.trim()
}

const getOptionalEnv = (key: string, defaultValue: string): string => {
  const value = getEnvValue(key)
  return value ? value.trim() : defaultValue
}

const devPort = isDev ? Number(getOptionalEnv('ELECTRON_RENDERER_PORT', '5173')) : 5173
const devHost = isDev ? getOptionalEnv('ELECTRON_RENDERER_HOST', 'localhost') : 'localhost'

export const config = {
  devPort,
  devHost,
  devURL: isDev ? getOptionalEnv('ELECTRON_RENDERER_URL', `http://${devHost}:${devPort}`) : '',

  openDevTools: isDev,

  dbFilePath: getRequiredEnv('DB_FILE_PATH'),
  dbFileName: getRequiredEnv('DB_FILE_NAME'),

  sentryDSN: getRequiredEnv('SENTRY_DSN'),
  sentryDevDSN: getRequiredEnv('SENTRY_DEV_DSN')
}

export type AppConfig = typeof config
