import { buildIndex } from './indexer'
import { search } from './searcher'
import { answer } from './answerer'
import { generateCommitMessage } from './commit'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { config } from './env'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = join(__dirname, '../../..')

async function main() {
  const args = process.argv.slice(2)
  const reindex = args.includes('--reindex')
  const commit = args.includes('--commit')
  const query = args.filter((a) => !a.startsWith('--'))[0]

  if (commit) {
    await generateCommitMessage(config.groqApiKey)
    return
  }

  if (reindex) {
    await buildIndex(ROOT_DIR, config.jinaApiKey)
    if (!query) return
  }

  if (!query) {
    console.log('Usage:')
    console.log('  pnpm ask <question>           :Question')
    console.log('  pnpm ask --reindex            :Rebuild index')
    console.log('  pnpm ask --reindex <question> :Rebuild index and ask question')
    console.log('  pnpm ask --commit             :Generate commit message')
    return
  }

  process.stdout.write('Searching for relevant code chunks...\r')
  const start = Date.now()
  const results = await search(query, config.jinaApiKey)
  const elapsed = Date.now() - start

  console.log(`Found ${results.length} relevant chunks in ${(elapsed / 1000).toFixed(2)} seconds.`)

  for (const r of results) {
    console.log(
      `  ${r.chunk.filePath}:${r.chunk.lineStart}-${r.chunk.lineEnd}  (score: ${r.score.toFixed(3)})`
    )
  }

  console.log('')
  await answer(query, results, config.groqApiKey)
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
