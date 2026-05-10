import { eq, sql } from 'drizzle-orm'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from '../database/schema'
import { taskReflections } from '../database/schema'
import type {
  TaskReflection,
  CreateReflectionParams,
  UpdateReflectionParams
} from '../../shared/types'

export class ReflectionRepository {
  constructor(private db: BetterSQLite3Database<typeof schema>) {}

  findByTaskId(taskId: string): TaskReflection | null {
    const reflection = this.db
      .select()
      .from(taskReflections)
      .where(eq(taskReflections.taskId, taskId))
      .get()

    return reflection ?? null
  }

  create(params: CreateReflectionParams): TaskReflection {
    const modelName = process.env.MODEL_NAME ?? null

    const result = this.db
      .insert(taskReflections)
      .values({
        taskId: params.taskId,
        content: params.content,
        originalNoteHash: params.originalNoteHash ?? null,
        modelName
      })
      .returning()
      .get()

    if (!result) {
      throw new Error('Failed to create reflection')
    }

    return result
  }

  update(params: UpdateReflectionParams): TaskReflection {
    const result = this.db
      .update(taskReflections)
      .set({
        content: params.content,
        originalNoteHash: params.originalNoteHash ?? null,
        updatedAt: sql`(datetime('now'))`
      })
      .where(eq(taskReflections.id, params.id))
      .returning()
      .get()

    if (!result) {
      throw new Error('Reflection not found')
    }

    return result
  }

  delete(taskId: string): void {
    this.db.delete(taskReflections).where(eq(taskReflections.taskId, taskId)).run()
  }

  upsert(params: CreateReflectionParams): TaskReflection {
    const existing = this.findByTaskId(params.taskId)

    if (existing) {
      return this.update({
        id: existing.id,
        taskId: params.taskId,
        content: params.content,
        originalNoteHash: params.originalNoteHash
      })
    }

    return this.create(params)
  }
}
