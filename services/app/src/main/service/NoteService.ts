import { TaskNote } from '../../types'
import { NoteRepository } from '../repository/noteRepository'
import { GeminiService } from './GeminiService'

type AutoSaveResult =
  | { savedAt: number; conflict: true }
  | { note: TaskNote; savedAt: number; conflict: false }

export class NoteService {
  private queue: Promise<AutoSaveResult> = Promise.resolve({ savedAt: Date.now(), conflict: true })

  constructor(
    private repo: NoteRepository,
    private geminiService: GeminiService
  ) {
    this.repo = repo
    this.geminiService = geminiService
  }

  autoSave(taskId: string, content: string, clientUpdatedAt: number) {
    this.queue = this.queue.then(async () => {
      const last = this.repo.findByTaskId(taskId)

      if (last && last.updated_at > clientUpdatedAt) {
        return { savedAt: last.updated_at, conflict: true }
      }

      const savedAt = Date.now()
      const note = this.repo.upsert(taskId, content, savedAt)
      return { note, savedAt, conflict: false }
    })

    return this.queue
  }

  reflectionNote(text: string) {
    return this.geminiService.reflectionNote(text)
  }
}
