import { Database } from 'better-sqlite3'

import { randomUUID } from 'crypto'
import { Task } from '../../types'

export class TaskRepository {
  constructor(private db: Database) {}

  create(task: Partial<Task>) {
    const id = randomUUID()
    const now = Date.now()

    const stmt = this.db
      .prepare(`INSERT INTO task (id, title, status, project_id, end_time, created_at, updated_at, done_at, deleted_at)
                VALUES (:id, :title, :status, :project_id, :end_time, datetime('now'), datetime('now'), :done_at, :deleted_at)`)

    stmt.run({
      id,
      title: task.title ?? 'Untitled',
      status: task.status ?? 'todo',
      project_id: task.project_id ?? null,
      end_time: task.end_time ?? null,
      created_at: task.created_at ?? now,
      updated_at: task.updated_at ?? now,
      done_at: task.done_at ?? null,
      deleted_at: task.deleted_at ?? null
    })

    return this.get(id)
  }

  get(id: string): Task | null {
    const stmt = this.db.prepare(`SELECT * FROM task WHERE id = ? AND deleted_at IS NULL`)
    const task = stmt.get(id) ?? null
    return task as Task | null
  }
}
