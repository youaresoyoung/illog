import { SearchResult } from './types'

export async function answer(
  query: string,
  results: SearchResult[],
  apikey: string
): Promise<void> {
  const context = results
    .map(
      (r) =>
        `---${r.chunk.filePath} (lines ${r.chunk.lineStart}-${r.chunk.lineEnd})---\n${r.chunk.content}`
    )
    .join('\n\n')

  const res = await fetch(process.env.GROQ_API_BASE_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apikey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL,
      stream: true,
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant for answering questions about the following codebase:\n\n${context}`
        },
        {
          role: 'user',
          content: `[Context]\n${context}\n\n[Question]\n${query}`
        }
      ]
    })
  })

  if (!res.ok) {
    throw new Error(`Groq API error: ${res.status} ${res.statusText}  - ${await res.text()}`)
  }

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const lines = decoder.decode(value).split('\n')
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') break

      try {
        const parsed = JSON.parse(data) as {
          choices: { delta: { content?: string } }[]
        }
        const content = parsed.choices[0]?.delta?.content
        if (content) process.stdout.write(content)
      } catch {
        // Ignore JSON parsing errors for incomplete chunks
      }
    }
  }

  console.log('\n')
}
