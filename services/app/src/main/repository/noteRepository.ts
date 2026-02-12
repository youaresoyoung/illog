import { eq } from 'drizzle-orm'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from '../database/schema'
import { taskNotes } from '../database/schema'
import type { TaskNote } from '../../shared/types'

export class NoteRepository {
  constructor(private db: BetterSQLite3Database<typeof schema>) {}

  findByTaskId(taskId: string): TaskNote | null {
    const note = this.db.select().from(taskNotes).where(eq(taskNotes.taskId, taskId)).get()

    return note ?? null
  }

  upsert(taskId: string, content: string, savedAt: number): TaskNote {
    const result = this.db
      .insert(taskNotes)
      .values({
        taskId,
        content,
        updatedAt: String(savedAt)
      })
      .onConflictDoUpdate({
        target: taskNotes.taskId,
        set: {
          content,
          updatedAt: String(savedAt)
        }
      })
      .returning()
      .get()

    if (!result) {
      throw new Error('Failed to upsert note')
    }

    return result
  }

  delete(taskId: string): void {
    this.db.delete(taskNotes).where(eq(taskNotes.taskId, taskId)).run()
  }
}
