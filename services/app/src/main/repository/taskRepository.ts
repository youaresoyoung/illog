import type { TaskFilterParams, TaskWithTags, UpdateTaskRequest } from '../../shared/types'
import { and, count, desc, eq, getTableColumns, gte, isNull, like, lte, or, sql } from 'drizzle-orm'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { InsertTask, tasks, tags, taskTags, projects, Tag, Task, Project } from '../database/schema'
import * as schema from '../database/schema'

export class TaskRepository {
  constructor(private db: BetterSQLite3Database<typeof schema>) {}

  async create(): Promise<TaskWithTags> {
    const [inserted] = this.db.insert(tasks).values({}).returning().all()

    return { ...inserted, tags: [], project: null }
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

  // NOTE: Need to refactor function name and tag section
  async getWithTags(id: string): Promise<TaskWithTags> {
    const task = this.db
      .select({
        ...getTableColumns(tasks),
        tags: sql`
        COALESCE(
            json_group_array(
              json_object('id', tag.id, 'name', tag.name, 'color', tag.color)
            ) FILTER (WHERE tag.id IS NOT NULL), json('[]')
          )`.as('tags'),
        project: sql`
          CASE WHEN project.id IS NOT NULL
            THEN json_object('id', project.id, 'name', project.name, 'color', project.color)
            ELSE NULL
          END`.as('project')
      })
      .from(tasks)
      .leftJoin(taskTags, eq(taskTags.taskId, tasks.id))
      .leftJoin(tags, and(eq(tags.id, taskTags.tagId), isNull(tags.deletedAt)))
      .leftJoin(projects, and(eq(projects.id, tasks.projectId), isNull(projects.deletedAt)))
      .where(and(eq(tasks.id, id), isNull(tasks.deletedAt)))
      .get()

    if (!task) {
      throw new Error('Task not found')
    }

    return {
      ...task,
      tags: JSON.parse(task.tags as string) as Tag[],
      project: task.project
        ? (JSON.parse(task.project as string) as Pick<Project, 'id' | 'name' | 'color'>)
        : null
    }
  }

  async getTasksWithTags(filters?: TaskFilterParams): Promise<TaskWithTags[]> {
    const conditions = [isNull(tasks.deletedAt)]

    if (filters?.status) {
      conditions.push(eq(tasks.status, filters.status))
    }
    if (filters?.projectId) {
      conditions.push(eq(tasks.projectId, filters?.projectId))
    }
    if (filters?.startTime) {
      conditions.push(gte(tasks.createdAt, new Date(filters.startTime)))
    }
    if (filters?.endTime) {
      conditions.push(lte(tasks.createdAt, new Date(filters.endTime)))
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
          )`.as('tags'),
        project: sql`
          CASE WHEN project.id IS NOT NULL
            THEN json_object('id', project.id, 'name', project.name, 'color', project.color)
            ELSE NULL
          END`.as('project')
      })
      .from(tasks)
      .leftJoin(taskTags, eq(taskTags.taskId, tasks.id))
      .leftJoin(tags, and(eq(tags.id, taskTags.tagId), isNull(tags.deletedAt)))
      .leftJoin(projects, and(eq(projects.id, tasks.projectId), isNull(projects.deletedAt)))
      .where(and(...conditions))
      .groupBy(tasks.id)
      .orderBy(desc(tasks.createdAt))
      .all()

    return results.map((item) => ({
      ...item,
      tags: JSON.parse(item?.tags as string),
      project: item.project ? JSON.parse(item.project as string) : null
    }))
  }

  async update(id: string, contents: UpdateTaskRequest): Promise<TaskWithTags> {
    const updateData: Partial<InsertTask> = {}

    if (contents.title !== undefined) {
      updateData.title = contents.title
    }
    if (contents.description !== undefined) {
      updateData.description = contents.description
    }
    if (contents.status !== undefined) {
      updateData.status = contents.status
      // 'done' 상태로 변경 시 doneAt 타임스탬프 설정
      if (contents.status === 'done') {
        updateData.doneAt = new Date()
      }
    }
    if (contents.projectId !== undefined) {
      updateData.projectId = contents.projectId
    }
    if (contents.startTime !== undefined) {
      updateData.startTime = contents.startTime ? new Date(contents.startTime) : null
    }
    if (contents.endTime !== undefined) {
      updateData.endTime = contents.endTime ? new Date(contents.endTime) : null
    }

    const result = this.db.update(tasks).set(updateData).where(eq(tasks.id, id)).run()

    if (result.changes === 0) {
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

    await this.db.insert(taskTags).values({
      taskId: taskId,
      tagId: tagId
    })

    return this.getWithTags(taskId)
  }

  async softDelete(id: string) {
    const deletedTask = await this.db
      .update(tasks)
      .set({ deletedAt: sql`(unixepoch())` })
      .where(and(eq(tasks.id, id), isNull(tasks.deletedAt)))

    if (deletedTask.changes === 0) {
      throw new Error('Task not found')
    }
  }

  async removeTag(taskId: string, tagId: string): Promise<TaskWithTags> {
    this.db
      .delete(taskTags)
      .where(and(eq(taskTags.taskId, taskId), eq(taskTags.tagId, tagId)))
      .run()

    return this.getWithTags(taskId)
  }
}
