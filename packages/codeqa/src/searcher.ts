import { existsSync, readFileSync } from 'fs'
import { IndexedChunk, SearchResult } from './types'
import { INDEX_FILE } from './common'

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

async function embedQuery(query: string, apiKey: string): Promise<number[]> {
  const res = await fetch(process.env.JINA_API_BASE_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.JINA_MODEL,
      task: 'retrieval.query',
      input: [query]
    })
  })

  if (!res.ok) {
    throw new Error(`Jina API error: ${res.status} ${res.statusText}  - ${await res.text()}`)
  }

  const data = (await res.json()) as { data: { embedding: number[] }[]; embeddings: number[][] }
  return data.data[0].embedding
}

export async function search(query: string, apiKey: string, topK = 5): Promise<SearchResult[]> {
  if (!existsSync(INDEX_FILE)) {
    throw new Error('Index file not found. Please run "pnpm ask --reindex" first.')
  }

  const chunks: IndexedChunk[] = JSON.parse(readFileSync(INDEX_FILE, 'utf-8'))
  const queryEmbedding = await embedQuery(query, apiKey)

  return chunks
    .map((chunk) => ({
      chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
}
