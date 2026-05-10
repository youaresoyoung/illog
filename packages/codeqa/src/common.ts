import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const INDEX_DIR = join(__dirname, '../.index')
export const INDEX_FILE = join(INDEX_DIR, 'chunks.json')
