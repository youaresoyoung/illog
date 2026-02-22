import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const ENV_FILE = join(__dirname, '../.env.codeqa')

function getConfig() {
  if (!existsSync(ENV_FILE)) {
    console.error(
      '❌ .env.codeqa file not found. Please create one with JINA_API_KEY and GROQ_API_KEY.'
    )
    process.exit(1)
  }

  dotenv.config({ path: ENV_FILE })
}

function getEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    console.error(`❌ Environment variable ${name} is not set.`)
    process.exit(1)
  }
  return value
}

getConfig()
export const config = {
  jinaApiKey: getEnv('JINA_API_KEY'),
  jinaApiBaseUrl: getEnv('JINA_API_BASE_URL'),
  jinaModel: getEnv('JINA_MODEL'),
  groqApiKey: getEnv('GROQ_API_KEY'),
  groqApiBaseUrl: getEnv('GROQ_API_BASE_URL'),
  groqModel: getEnv('GROQ_MODEL')
}
