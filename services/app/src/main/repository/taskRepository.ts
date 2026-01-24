import { OmittedTask, TaskFilters, TaskWithTags } from '../types'
import { and, count, desc, eq, getTableColumns, gte, isNull, like, lte, or, sql } from 'drizzle-orm'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { InsertTask, tasks, tags, taskTags, Tag, Task } from '../database/schema'
import * as schema from '../database/schema'
import Database from 'better-sqlite3'

export class TaskRepository {
  constructor(
    private db: BetterSQLite3Database<typeof schema>,
    private sqlite: Database.Database
  ) {}

  async create(task: InsertTask): Promise<TaskWithTags> {
    const [inserted] = this.db.insert(tasks).values(task).returning().all()

    return { ...inserted, tags: [] }
  }

  async get(id: string): Promise<Task> {
    const task = this.db
      .select()
      .from(tasks)
      .where(and(eq(tasks.id, id), isNull(tasks.deletedAt)))
      .get()

    if (!task) {
      throw new Error('Task not found')
    }

    return task
  }

  async getWithTags(id: string): Promise<TaskWithTags> {
    const task = this.db
      .select({
        ...getTableColumns(tasks),
        tags: sql`
        COALESCE(
            json_group_array(
              json_object('id', tag.id, 'name', tag.name, 'color', tag.color)
            ) FILTER (WHERE tag.id IS NOT NULL), json('[]')
          )`.as('tags')
      })
      .from(tasks)
      .leftJoin(taskTags, eq(taskTags.taskId, tasks.id))
      .leftJoin(tags, and(eq(tags.id, taskTags.tagId), isNull(tags.deletedAt)))
      .where(and(eq(tasks.id, id), isNull(tasks.deletedAt)))
      .get()

    if (!task) {
      throw new Error('Task not found')
    }

    return {
      ...task,
      tags: JSON.parse(task.tags as string) as Tag[]
    }
  }

  async getTasksWithTags(filters?: TaskFilters): Promise<TaskWithTags[]> {
    const conditions = [isNull(tasks.deletedAt)]

    if (filters?.status) {
      conditions.push(eq(tasks.status, filters.status))
    }
    if (filters?.project_id) {
      conditions.push(eq(tasks.projectId, filters?.project_id))
    }
    if (filters?.date_from) {
      const dateFrom = filters?.time_zone
        ? new Date(filters.date_from).toISOString()
        : filters.date_from
      conditions.push(gte(tasks.createdAt, dateFrom))
    }
    if (filters?.date_to) {
      const dateTo = filters?.time_zone ? new Date(filters.date_to).toISOString() : filters.date_to
      conditions.push(lte(tasks.createdAt, dateTo))
    }
    if (filters?.search) {
      const searchCondition = or(
        like(tasks.title, `%${filters?.search}%`),
        like(tasks.description, `%${filters?.search}%`)
      )
      if (searchCondition) {
        conditions.push(searchCondition)
      }
    }

    const results = this.db
      .select({
        ...getTableColumns(tasks),
        tags: sql`
        COALESCE(
            json_group_array(
              json_object('id', tag.id, 'name', tag.name, 'color', tag.color)
            ) FILTER (WHERE tag.id IS NOT NULL), json('[]')
          )`.as('tags')
      })
      .from(tasks)
      .leftJoin(taskTags, eq(taskTags.taskId, tasks.id))
      .leftJoin(tags, and(eq(tags.id, taskTags.tagId), isNull(tags.deletedAt)))
      .where(and(...conditions))
      .groupBy(tasks.id)
      .orderBy(desc(tasks.createdAt))
      .all()

    return results.map((item) => ({ ...item, tags: JSON.parse(item?.tags as string) }))
  }

  async update(id: string, contents: Partial<OmittedTask>): Promise<TaskWithTags> {
    const now = new Date().toISOString()
    const updateData: Record<string, unknown> = { updatedAt: now }

    if (contents.title !== undefined) {
      updateData.title = contents.title
    }
    if (contents.description !== undefined) {
      updateData.description = contents.description
    }
    if (contents.status !== undefined) {
      updateData.status = contents.status
    }
    if (contents.projectId !== undefined) {
      updateData.projectId = contents.projectId
    }
    if (contents.startAt !== undefined) {
      updateData.startAt = contents.startAt
    }
    if (contents.endAt !== undefined) {
      updateData.endAt = contents.endAt
    }

    if (updateData.length === 1) {
      return this.getWithTags(id)!
    }

    const task = await this.db.update(tasks).set(updateData).where(eq(tasks.id, id))

    if (task.changes === 0) {
      throw new Error('Task not found or no changes made')
    }

    return this.getWithTags(id)
  }

  async addTag(taskId: string, tagId: string): Promise<TaskWithTags> {
    const [result] = await this.db
      .select({ count: count() })
      .from(taskTags)
      .where(eq(taskTags.taskId, taskId))

    if (result.count >= 5) {
      throw new Error('A task can have a maximum of 5 tags')
    }

    const exists = await this.db
      .select({ one: taskTags.taskId })
      .from(taskTags)
      .where(and(eq(taskTags.taskId, taskId), eq(taskTags.tagId, tagId)))
      .limit(1)

    if (exists.length > 0) {
      throw new Error('Tag already associated with the task')
    }

    const now = new Date().toISOString()

    await this.db.insert(taskTags).values({
      taskId: taskId,
      tagId: tagId
    })
    await this.db.update(tasks).set({ updatedAt: now }).where(eq(tasks.id, taskId))

    return this.getWithTags(taskId)
  }

  async softDelete(id: string) {
    const now = new Date().toISOString()

    const deletedTask = await this.db
      .update(tasks)
      .set({ deletedAt: now })
      .where(and(eq(tasks.id, id), isNull(tasks.deletedAt)))

    if (deletedTask.changes === 0) {
      throw new Error('Task not found')
    }
  }

  async removeTag(taskId: string, tagId: string) {
    const now = new Date().toISOString()

    await this.db
      .delete(taskTags)
      .where(and(eq(taskTags.taskId, taskId), eq(taskTags.tagId, tagId)))
    await this.db.update(tasks).set({ updatedAt: now }).where(eq(tasks.id, taskId))

    return this.getWithTags(taskId)!
  }
}
