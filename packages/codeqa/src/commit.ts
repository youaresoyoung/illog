import { execFileSync } from 'child_process'
import { writeFileSync, unlinkSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { config } from './env'

function getStagedDiff() {
  try {
    const stat = execFileSync('git', ['diff', '--cached', '--stat'], { encoding: 'utf-8' })
    const diff = execFileSync('git', ['diff', '--cached'], { encoding: 'utf-8' }).trim()
    return { stat, diff }
  } catch (err) {
    console.error('❌ Error running git diff:', err)
    process.exit(1)
  }
}

export async function generateCommitMessage(apiKey: string): Promise<string> {
  const { stat, diff } = getStagedDiff()

  if (!diff) {
    console.error('⚠️ No staged changes. Run "git add" first.')
    process.exit(1)
  }

  // diff 가 너무 크면 앞부분만 사용 (Groq 컨텍스트 제한 대응)
  const MAX_DIFF_CHARS = 12000
  const truncated = diff.length > MAX_DIFF_CHARS
  const diffForPrompt = truncated
    ? diff.slice(0, MAX_DIFF_CHARS) + '\n... (truncated due to size limit)'
    : diff

  const res = await fetch(config.groqApiBaseUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: config.groqModel,
      stream: true,
      messages: [
        {
          role: 'system',
          content: `You are a senior engineer writing production-grade git commit messages for a collaborative team environment.

                    Strictly follow the commit format enforced by Husky:

                    Valid formats:
                    - type: description
                    - type(scope): description
                    - [#issue] type(scope): description
                    - [PROJ-123] type(scope): description
                    - :gitmoji: description

                    Preferred format:
                    type(scope): clear, concise, business-relevant description

                    Allowed types:
                    feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert

                    Rules:
                    - Max 72 characters for the first line
                    - Lowercase, no trailing period
                    - Use imperative mood (e.g., "add", "fix", "remove")
                    - Avoid vague words like "update", "change", "fix stuff"
                    - Include scope when possible (auth, api, ui, db, config, etc.)
                    - Describe the intent and impact, not just the code change

                    For non-trivial commits:
                    Add a blank line followed by bullet points covering:
                    - what was changed
                    - why it was needed
                    - any technical or product impact

                    Focus on:
                    - readability in git history
                    - usefulness in code reviews
                    - long-term maintainability

                    Output ONLY the commit message.
                    No explanations.
                    No markdown.`
        },
        { role: 'user', content: `Changed files: \n${stat}\n\nDiff:\n${diffForPrompt}` }
      ]
    })
  })

  if (!res.ok) {
    throw new Error(`Groq API error: ${res.status} ${await res.text()}`)
  }

  if (!res.body) {
    throw new Error('No response body from Groq API')
  }
  const reader = res.body.getReader()
  const decoder = new TextDecoder()

  let fullMessage = ''
  let finished = false
  while (!finished) {
    const { done, value } = await reader.read()
    if (done) break

    const lines = decoder.decode(value).split('\n')
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') {
        finished = true
        break
      }

      try {
        const parsed = JSON.parse(data) as {
          choices: { delta: { content: string } }[]
        }
        const content = parsed?.choices?.[0]?.delta?.content
        if (content) {
          process.stdout.write(content)
          fullMessage += content
        }
      } catch {
        // skip incomplete chunks
      }
    }
  }

  console.log('\n')
  return fullMessage.trim()
}

/**
 * 생성된 커밋 메시지로 스테이징된 변경사항을 실제로 커밋한다.
 * LLM 출력에 따옴표/백틱이 섞여도 깨지지 않도록 -m 대신 임시 파일(-F)을 사용한다.
 */
export function commitWithMessage(message: string): void {
  const tmpFile = join(tmpdir(), `illog-commit-msg-${Date.now()}.txt`)
  writeFileSync(tmpFile, message, 'utf-8')

  try {
    execFileSync('git', ['commit', '-F', tmpFile], { stdio: 'inherit' })
  } catch {
    process.exit(1)
  } finally {
    unlinkSync(tmpFile)
  }
}
