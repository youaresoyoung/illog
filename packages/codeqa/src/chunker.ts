import { readFileSync } from 'fs'
import type { Chunk } from './types'
import { relative } from 'path'

const MAX_LINES_SIGNLE_CHUNK = 150

export function chunkFile(absolutePath: string, rootDir: string): Chunk[] {
  const content = readFileSync(absolutePath, 'utf-8')
  const relativePath = relative(rootDir, absolutePath)
  const lines = content.split('\n')

  if (lines.length <= MAX_LINES_SIGNLE_CHUNK) {
    return [
      {
        id: `${relativePath}:1`,
        filePath: relativePath,
        content: content.trim(),
        lineStart: 1,
        lineEnd: lines.length
      }
    ]
  }

  // MAX_LINES_SIGNLE_CHUNK 초과 파일: 연속 빈 줄 2개 기준으로 섹션 분리 (함수/클래스 경계)
  const chunks: Chunk[] = []
  let currentLine = 1
  let sectionStart = 0
  let blankCount = 0

  for (let i = 0; i < lines.length; i++) {
    const isBlank = lines[i].trim() === ''

    if (isBlank) {
      blankCount++
    } else {
      if (blankCount >= 2 && i > sectionStart) {
        const sectionLines = lines.slice(sectionStart, i - blankCount)
        const sectionContent = sectionLines.join('\n').trim()

        if (sectionContent.length > 20) {
          chunks.push({
            id: `${relativePath}:${currentLine}`,
            filePath: relativePath,
            content: sectionContent,
            lineStart: currentLine,
            lineEnd: currentLine + sectionLines.length - 1
          })
        }

        currentLine = i + 1
        sectionStart = i
      }
      blankCount = 0
    }
  }

  // 마지막 섹션 처리 (남은 라인)
  const remaining = lines.slice(sectionStart).join('\n').trim()
  if (remaining.length > 20) {
    chunks.push({
      id: `${relativePath}:${currentLine}`,
      filePath: relativePath,
      content: remaining,
      lineStart: currentLine,
      lineEnd: lines.length
    })
  }

  // If no sections were created (e.g. no double blank lines), return the whole file as one chunk
  if (chunks.length === 0) {
    return [
      {
        id: `${relativePath}:1`,
        filePath: relativePath,
        content: content.trim(),
        lineStart: 1,
        lineEnd: lines.length
      }
    ]
  }

  return chunks
}
