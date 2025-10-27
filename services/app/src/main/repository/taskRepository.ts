import { Database } from 'better-sqlite3'

import { randomUUID } from 'crypto'
import { OmittedTask, Task, TaskWithTags } from '../../types'

// TODO: apply zod
export class TaskRepository {
  constructor(private db: Database) {}

  create(task: Partial<OmittedTask>): TaskWithTags {
    const id = randomUUID()
    const now = new Date().toISOString()

    const { title = 'Untitled', status = 'todo', project_id = null } = task

    const stmt = this.db
      .prepare(`INSERT INTO task (id, title, status, project_id, end_time, created_at, updated_at, done_at, deleted_at)
                VALUES (:id, :title, :status, :project_id, :end_time, :created_at, :updated_at , :done_at, :deleted_at)`)

    stmt.run({
      id,
      title,
      status,
      project_id,
      end_time: null,
      created_at: now,
      updated_at: now,
      done_at: null,
      deleted_at: null
    })

    return this.getWithTags(id)!
  }

  get(id: string): Task | null {
    const stmt = this.db.prepare(`SELECT * FROM task WHERE id = :id AND deleted_at IS NULL`)
    const task = stmt.get({ id }) as Task | undefined
    return task ?? null
  }

  getWithTags(id: string): TaskWithTags | null {
    const stmt = this.db.prepare(
      `SELECT task.*,
          COALESCE(
            json_group_array(
              json_object('id', tag.id, 'name', tag.name, 'color', tag.color)
            ) FILTER (WHERE tag.id IS NOT NULL), json('[]')
          ) AS tags
       FROM task
       LEFT JOIN task_tag ON task_tag.task_id = task.id
       LEFT JOIN tag ON tag.id = task_tag.tag_id AND tag.deleted_at IS NULL
       WHERE task.id = :id AND task.deleted_at IS NULL
       GROUP BY task.id`
    )
    const task = stmt.get({ id }) as TaskWithTags | undefined
    if (task) {
      task.tags = JSON.parse(task?.tags as unknown as string) || []
    }
    return task ?? null
  }

  getAll(): TaskWithTags[] {
    const date = new Date().toISOString().split('T')[0]

    const stmt = this.db.prepare(
      `SELECT task.*,
          COALESCE(
            json_group_array(
              json_object('id', tag.id, 'name', tag.name, 'color', tag.color)
            ) FILTER (WHERE tag.id IS NOT NULL), json('[]')
          ) AS tags
       FROM task
       LEFT JOIN task_tag ON task_tag.task_id = task.id
       LEFT JOIN tag ON tag.id = task_tag.tag_id AND tag.deleted_at IS NULL
       WHERE substr(task.created_at, 1, 10) = :date AND task.deleted_at IS NULL
       GROUP BY task.id
       ORDER BY task.created_at ASC`
    )
    const tasks = stmt.all({ date }) as TaskWithTags[] | undefined
    if (tasks) {
      tasks.forEach((task) => {
        task.tags = JSON.parse(task?.tags as unknown as string) || []
      })
    }
    return tasks as TaskWithTags[]
  }

  update(id: string, contents: Partial<OmittedTask>): TaskWithTags {
    const now = new Date().toISOString()

    const updates: string[] = []
    const params: Record<string, unknown> = { id, updated_at: now }

    if (contents.title !== undefined) {
      updates.push('title = :title')
      params.title = contents.title
    }
    if (contents.description !== undefined) {
      updates.push('description = :description')
      params.description = contents.description
    }
    if (contents.status !== undefined) {
      updates.push('status = :status')
      params.status = contents.status
    }
    if (contents.project_id !== undefined) {
      updates.push('project_id = :project_id')
      params.project_id = contents.project_id
    }

    updates.push('updated_at = :updated_at')

    if (updates.length === 1) {
      return this.getWithTags(id)!
    }

    const query = `UPDATE task SET ${updates.join(', ')} WHERE id = :id AND deleted_at IS NULL`
    const stmt = this.db.prepare(query)
    const result = stmt.run(params)

    if (result.changes === 0) {
      throw new Error('Task not found or no changes made')
    }

    return this.getWithTags(id)!
  }

  addTag(taskId: string, tagId: string) {
    const { count } = this.db
      .prepare(`SELECT COUNT(*) as count FROM task_tag WHERE task_id = :taskId`)
      .get({ taskId }) as { count: number }
    if (count >= 5) {
      throw new Error('A task can have a maximum of 5 tags')
    }

    const exists = this.db
      .prepare(`SELECT 1 FROM task_tag WHERE task_id = :taskId AND tag_id = :tagId`)
      .get({ taskId, tagId })
    if (exists) {
      throw new Error('Tag already associated with the task')
    }

    const stmt = this.db.prepare(`INSERT INTO task_tag (task_id, tag_id) VALUES (:taskId, :tagId)`)
    stmt.run({ taskId, tagId })
    return this.getWithTags(taskId)!
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

  removeTag(taskId: string, tagId: string) {
    const stmt = this.db.prepare(`DELETE FROM task_tag WHERE task_id = :taskId AND tag_id = :tagId`)
    stmt.run({ taskId, tagId })

    return this.getWithTags(taskId)!
  }
}
