export type Chunk = {
  id: string
  filePath: string
  content: string
  lineStart: number
  lineEnd: number
}

export type IndexedChunk = Chunk & {
  embedding: number[]
}

export type SearchResult = {
  chunk: IndexedChunk
  score: number
}
