import { Database } from 'better-sqlite3'

import { randomUUID } from 'crypto'
import { Task } from '../../types'

// TODO: apply zod
export class TaskRepository {
  constructor(private db: Database) {}

  create(task: Partial<Task>) {
    const id = randomUUID()
    const now = new Date().toISOString()

    const {
      title = 'Untitled',
      status = 'todo',
      project_id = null,
      end_time = null,
      created_at = now,
      updated_at = now,
      done_at = null,
      deleted_at = null
    } = task

    const stmt = this.db
      .prepare(`INSERT INTO task (id, title, status, project_id, end_time, created_at, updated_at, done_at, deleted_at)
                VALUES (:id, :title, :status, :project_id, :end_time, :created_at, :updated_at , :done_at, :deleted_at)`)

    stmt.run({
      id,
      title,
      status,
      project_id,
      end_time,
      created_at,
      updated_at,
      done_at,
      deleted_at
    })

    return this.get(id)
  }

  get(id: string): Task | null {
    const stmt = this.db.prepare(`SELECT * FROM task WHERE id = :id AND deleted_at IS NULL`)
    const task = stmt.get({ id }) as Task | undefined
    return task ?? null
  }

  getAll(): Task[] {
    const date = new Date().toISOString().split('T')[0]

    const stmt = this.db.prepare(
      `SELECT * FROM task WHERE substring(created_at, 1, 10) = :date AND deleted_at IS NULL`
    )
    const tasks = stmt.all({ date })
    return tasks as Task[]
  }

  update(id: string, contents: Partial<Task>): Task {
    const now = new Date().toISOString()

    const stmt = this.db.prepare(
      `UPDATE task 
       SET title = COALESCE(:title, title), 
           status = COALESCE(:status, status),
           project_id = COALESCE(:project_id, project_id),
           end_time = COALESCE(:end_time, end_time),
           updated_at = :updated_at
       WHERE id = :id AND deleted_at IS NULL`
    )

    const result = stmt.run({ ...contents, updated_at: now, id })

    if (result.changes === 0) {
      throw new Error('Task not found or no changes made')
    }

    return this.get(id)!
  }

  softDelete(id: string) {
    const now = new Date().toISOString()

    const stmt = this.db.prepare(
      `UPDATE task SET deleted_at = :now WHERE id = :id AND deleted_at IS NULL`
    )
    const row = stmt.run({ now, id })

    if (row.changes === 0) {
      throw new Error('Task not found')
    }
  }
}
