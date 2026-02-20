import dotenv from 'dotenv'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { buildIndex } from './indexer'
import { search } from './searcher'
import { answer } from './answerer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = join(__dirname, '../../..')
const ENV_FILE = join(__dirname, '../.env.codeqa')

function loadEnv() {
  if (!existsSync(ENV_FILE)) {
    console.error(
      '❌ .env.codeqa file not found. Please create one with JINA_API_KEY and GROQ_API_KEY.'
    )
    process.exit(1)
  }

  dotenv.config({ path: ENV_FILE })

  const jinaKey = process.env.JINA_API_KEY
  const groqKey = process.env.GROQ_API_KEY

  if (!jinaKey || !groqKey) {
    console.error(
      '❌ JINA_API_KEY or GROQ_API_KEY not found in .env.codeqa. Please add them before running the tool.'
    )
    process.exit(1)
  }

  return { jinaKey, groqKey }
}

async function main() {
  const args = process.argv.slice(2)
  const reindex = args.includes('--reindex')
  const query = args.filter((a) => !a.startsWith('--'))[0]

  const { jinaKey, groqKey } = loadEnv()

  if (reindex) {
    await buildIndex(ROOT_DIR, jinaKey)
    if (!query) return
  }

  if (!query) {
    console.log('Usage:')
    console.log('  pnpm ask <question>           :Question')
    console.log('  pnpm ask --reindex            :Rebuild index')
    console.log('  pnpm ask --reindex <question> :Rebuild index and ask question')
    return
  }

  process.stdout.write('Searching for relevant code chunks...\r')
  const start = Date.now()
  const results = await search(query, jinaKey)
  const elapsed = Date.now() - start

  console.log(`Found ${results.length} relevant chunks in ${(elapsed / 1000).toFixed(2)} seconds.`)

  for (const r of results) {
    console.log(
      `  ${r.chunk.filePath}:${r.chunk.lineStart}-${r.chunk.lineEnd}  (score: ${r.score.toFixed(3)})`
    )
  }

  console.log('')
  await answer(query, results, groqKey)
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
