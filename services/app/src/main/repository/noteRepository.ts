import { Database } from 'better-sqlite3'
import { TaskNote } from '../../types'

export class NoteRepository {
  constructor(private db: Database) {}

  findByTaskId(taskId: string): TaskNote | null {
    const stmt = this.db.prepare(`SELECT * FROM task_note WHERE task_id = ?`)
    return stmt.get(taskId) as TaskNote | null
  }

  update(taskId: string, content: string, savedAt: number): TaskNote {
    const stmt = this.db.prepare(
      `UPDATE task_note SET content = ?, updated_at = ? WHERE task_id = ?`
    )
    const result = stmt.run({
      content,
      updated_at: savedAt,
      task_id: taskId
    })

    if (result.changes === 0) {
      throw new Error('Task not found or no changes made')
    }

    return this.findByTaskId(taskId) as TaskNote
  }
}
