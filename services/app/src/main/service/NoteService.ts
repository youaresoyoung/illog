import { createHash } from 'crypto'
import { TaskNote, TaskReflection } from '../types'
import { NoteRepository } from '../repository/noteRepository'
import { GeminiService } from './GeminiService'
import { ReflectionRepository } from '../repository/reflectionRepository'

type AutoSaveResult =
  | { savedAt: number; conflict: true }
  | { note: TaskNote; savedAt: number; conflict: false }

export class NoteService {
  private queue: Promise<AutoSaveResult> = Promise.resolve({ savedAt: Date.now(), conflict: true })

  constructor(
    private repo: NoteRepository,
    private reflectionRepo: ReflectionRepository,
    private geminiService: GeminiService
  ) {
    this.repo = repo
    this.reflectionRepo = reflectionRepo
    this.geminiService = geminiService
  }

  autoSave(taskId: string, content: string, clientUpdatedAt: number) {
    this.queue = this.queue.then(async () => {
      const last = this.repo.findByTaskId(taskId)

      if (last && Number(last.updated_at) > clientUpdatedAt) {
        return { savedAt: Number(last.updated_at), conflict: true }
      }

      const savedAt = Date.now()
      const note = this.repo.upsert(taskId, content, savedAt)
      return { note, savedAt, conflict: false }
    })

    return this.queue
  }

  async *reflectionNoteStream(
    textId: string,
    text: string
  ): AsyncGenerator<{ chunk: string; done: boolean }, void> {
    let fullContent = ''
    const noteHash = createHash('sha256').update(text).digest('hex')

    for await (const chunk of this.geminiService.reflectionNoteStream(text)) {
      fullContent += chunk
      yield { chunk, done: false }
    }

    this.reflectionRepo.upsert({
      task_id: textId,
      content: fullContent,
      original_note_hash: noteHash
    })
    yield { chunk: '', done: true }
  }

  getReflection(taskId: string): TaskReflection | null {
    return this.reflectionRepo.findByTaskId(taskId)
  }

  deleteReflection(taskId: string): void {
    this.reflectionRepo.delete(taskId)
  }
}
