import { NoteRepository } from '../repository/noteRepository'

export class NoteService {
  private queue: Promise<any> = Promise.resolve()

  constructor(private repo: NoteRepository) {}

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
}
