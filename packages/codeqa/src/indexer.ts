import { glob } from 'glob'
import { chunkFile } from './chunker'
import { mkdirSync, writeFileSync } from 'fs'
import { IndexedChunk } from './types'
import { INDEX_DIR, INDEX_FILE } from './common'

// Free: 100K tokens/per minute -> 20 files/minute
const BATCH_SIZE = 20
const BATCH_DELAY_MS = 3000

const IGNORE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/.vite/**',
  '**/out/**',
  '**/.next/**',
  '**/*.d.ts',
  '**/*.test.ts',
  '**/*.spec.ts',
  '**/storybook-static/**',
  'packages/codeqa/**'
]

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function embedBatch(texts: string[], apiKey: string): Promise<number[][]> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(process.env.JINA_API_BASE_URL!, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.JINA_MODEL,
        task: 'retrieval.passage',
        input: texts
      })
    })

    if (res.status === 429) {
      const waitSec = attempt * 60
      process.stdout.write(
        `Rate limited. Waiting for ${waitSec} seconds before retrying... (${attempt}/3)\n`
      )
      await sleep(waitSec * 1000)
      continue
    }

    if (!res.ok) {
      throw new Error(`Jina API error: ${res.status} ${res.statusText}  - ${await res.text()}`)
    }

    const data = (await res.json()) as { data: { embedding: number[] }[] }
    return data.data.map((d) => d.embedding)
  }

  throw new Error('Jina API error: Rate limit exceeded after 3 attempts.')
}

export async function buildIndex(rootDir: string, apiKey: string) {
  console.log('Building index...')

  const files = await glob('**/*.{ts,tsx,js,jsx}', {
    cwd: rootDir,
    ignore: IGNORE_PATTERNS,
    absolute: true
  })

  console.log(`Found ${files.length} files to index.`)

  const allChucks = files.flatMap((f) => {
    try {
      return chunkFile(f, rootDir)
    } catch {
      return []
    }
  })

  console.log(`Extracted ${allChucks.length} chucks from files.`)

  const indexed: IndexedChunk[] = []
  const totalBatches = Math.ceil(allChucks.length / BATCH_SIZE)

  for (let i = 0; i < allChucks.length; i += BATCH_SIZE) {
    const batch = allChucks.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    process.stdout.write(`Processing batch ${batchNum}/${totalBatches}...\r`)

    const embeddings = await embedBatch(
      batch.map((c) => c.content),
      apiKey
    )

    for (let j = 0; j < batch.length; j++) {
      indexed.push({
        ...batch[j],
        embedding: embeddings[j]
      })
    }

    // 마지막 배치가 아니면 rate limit 방지 위해 잠시 대기
    if (i + BATCH_SIZE < allChucks.length) {
      await sleep(BATCH_DELAY_MS)
    }
  }

  console.log(`\nIndexed ${indexed.length} chucks.`)
  mkdirSync(INDEX_DIR, { recursive: true })
  writeFileSync(INDEX_FILE, JSON.stringify(indexed))
  console.log(`Index saved to ${INDEX_FILE}`)
}
