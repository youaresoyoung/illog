import { Database } from 'better-sqlite3'
import { TaskNote } from '../../types'

export class NoteRepository {
  constructor(private db: Database) {}

  findByTaskId(taskId: string): TaskNote | null {
    const stmt = this.db.prepare(`SELECT * FROM task_note WHERE task_id = :taskId`)
    return stmt.get({ taskId }) as TaskNote | null
  }

  upsert(taskId: string, content: string, savedAt: number): TaskNote {
    const stmt = this.db.prepare(
      `INSERT INTO task_note (task_id, content, updated_at)
      VALUES (:taskId, :content, :savedAt)
      ON CONFLICT(task_id) DO UPDATE SET
      content = excluded.content,
      updated_at = excluded.updated_at`
    )
    const result = stmt.run({ taskId, content, savedAt })

    if (result.changes === 0) {
      throw new Error('Task not found or no changes made')
    }

    return this.findByTaskId(taskId) as TaskNote
  }
}
