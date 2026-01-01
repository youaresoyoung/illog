import { Database } from 'better-sqlite3'
import { CreateTaskReflectionParams, TaskReflection, UpdateTaskReflectionParams } from '../types'
import { randomUUID } from 'crypto'

export class ReflectionRepository {
  constructor(private db: Database) {}

  findByTaskId(taskId: string): TaskReflection | null {
    const stmt = this.db.prepare('SELECT * FROM task_reflection WHERE task_id = :taskId')
    return stmt.get({ taskId }) as TaskReflection | null
  }

  create({
    task_id,
    content,
    original_note_hash
  }: CreateTaskReflectionParams): Omit<TaskReflection, 'model_name'> {
    const id = randomUUID()
    const now = Date.now().toLocaleString()
    const model_name = process.env.MODEL_NAME
    const stmt = this.db.prepare(
      `INSERT INTO task_reflection 
       (id, task_id, content, original_note_hash, model_name, created_at, updated_at) 
       VALUES 
       (:id, :task_id, :content, :original_note_hash, :model_name, :created_at, :updated_at)`
    )
    stmt.run({
      id,
      task_id,
      content,
      original_note_hash,
      model_name,
      created_at: now,
      updated_at: now
    })

    return this.findByTaskId(task_id)!
  }

  update({
    id,
    task_id,
    content,
    original_note_hash
  }: UpdateTaskReflectionParams): Omit<TaskReflection, 'model_name'> {
    const now = Date.now().toLocaleString()
    const stmt = this.db.prepare(
      `UPDATE task_reflection
       SET content = :content,
          original_note_hash = :original_note_hash,
          updated_at = :updated_at
      WHERE id = :id AND task_id = :task_id`
    )
    const result = stmt.run({
      id,
      task_id,
      content,
      original_note_hash,
      updated_at: now
    })

    if (result.changes === 0) {
      throw new Error('Reflection not found')
    }

    return this.findByTaskId(task_id)!
  }

  delete(taskId: string): void {
    const stmt = this.db.prepare('DELETE FROM task_reflection WHERE task_id = :taskId')
    stmt.run({ taskId })
  }

  upsert({
    task_id,
    content,
    original_note_hash
  }: CreateTaskReflectionParams | UpdateTaskReflectionParams): TaskReflection {
    const existing = this.findByTaskId(task_id)
    if (existing) {
      return this.update({ id: existing.id, task_id, content, original_note_hash })
    } else {
      return this.create({ task_id, content, original_note_hash })
    }
  }
}
