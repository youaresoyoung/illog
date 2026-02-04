import type { TaskFilterParams, TaskWithTags, UpdateTaskRequest } from '../../shared/types'
import { and, count, desc, eq, getTableColumns, gte, isNull, like, lte, or, sql } from 'drizzle-orm'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import {
  InsertTask,
  tasks,
  tags,
  taskTags,
  projects,
  Tag,
  Task,
  Project,
  TaskType,
  TaskSubtype,
  taskTypes,
  taskSubtypes
} from '../database/schema'
import * as schema from '../database/schema'

export class TaskRepository {
  constructor(private db: BetterSQLite3Database<typeof schema>) {}

  async create(): Promise<TaskWithTags> {
    const [inserted] = this.db.insert(tasks).values({}).returning().all()

    return { ...inserted, tags: [], project: null, taskType: null, taskSubtype: null }
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
          END`.as('project'),
        taskType: sql`
        CASE WHEN task_type.id IS NOT NULL
          THEN json_object('id', task_type.id, 'name', task_type.name, 'color', task_type.color)
          ELSE NULL
        END`.as('taskType'),
        taskSubtype: sql`
        CASE WHEN task_subtype.id IS NOT NULL
          THEN json_object('id', task_subtype.id, 'name', task_subtype.name)
          ELSE NULL
        END`.as('taskSubtype')
      })
      .from(tasks)
      .leftJoin(taskTags, eq(taskTags.taskId, tasks.id))
      .leftJoin(tags, and(eq(tags.id, taskTags.tagId), isNull(tags.deletedAt)))
      .leftJoin(projects, and(eq(projects.id, tasks.projectId), isNull(projects.deletedAt)))
      .leftJoin(taskTypes, and(eq(taskTypes.id, tasks.taskTypeId), isNull(taskTypes.deletedAt)))
      .leftJoin(
        taskSubtypes,
        and(eq(taskSubtypes.id, tasks.taskSubtypeId), isNull(taskSubtypes.deletedAt))
      )
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
        : null,
      taskType: task.taskType
        ? (JSON.parse(task.taskType as string) as Pick<TaskType, 'id' | 'name' | 'color'>)
        : null,
      taskSubtype: task.taskSubtype
        ? (JSON.parse(task.taskSubtype as string) as Pick<TaskSubtype, 'id' | 'name'>)
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
      // NOTE: The time filter logic is designed to include tasks that overlap with the specified time range.
      // This means:
      // - Tasks that start before the filter's startTime but end after it will be included (overlapping tasks).
      // - Tasks that start after the filter's startTime will also be included, regardless of their end time.

      const filterStart = new Date(filters.startTime)
      conditions.push(
        or(
          gte(tasks.endTime, filterStart),
          and(isNull(tasks.endTime), gte(tasks.startTime, filterStart))
        )!
      )
    }
    if (filters?.endTime) {
      const filterEnd = new Date(filters.endTime)
      conditions.push(lte(tasks.startTime, filterEnd))
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
          END`.as('project'),
        taskType: sql`
        CASE WHEN task_type.id IS NOT NULL
          THEN json_object('id', task_type.id, 'name', task_type.name, 'color', task_type.color)
          ELSE NULL
        END`.as('taskType'),
        taskSubtype: sql`
        CASE WHEN task_subtype.id IS NOT NULL
          THEN json_object('id', task_subtype.id, 'name', task_subtype.name)
          ELSE NULL
        END`.as('taskSubtype')
      })
      .from(tasks)
      .leftJoin(taskTags, eq(taskTags.taskId, tasks.id))
      .leftJoin(tags, and(eq(tags.id, taskTags.tagId), isNull(tags.deletedAt)))
      .leftJoin(projects, and(eq(projects.id, tasks.projectId), isNull(projects.deletedAt)))
      .leftJoin(taskTypes, and(eq(taskTypes.id, tasks.taskTypeId), isNull(taskTypes.deletedAt)))
      .leftJoin(
        taskSubtypes,
        and(eq(taskSubtypes.id, tasks.taskSubtypeId), isNull(taskSubtypes.deletedAt))
      )
      .where(and(...conditions))
      .groupBy(tasks.id)
      .orderBy(desc(tasks.createdAt))
      .all()

    return results.map((item) => ({
      ...item,
      tags: JSON.parse(item?.tags as string),
      project: item.project ? JSON.parse(item.project as string) : null,
      taskType: item.taskType ? JSON.parse(item.taskType as string) : null,
      taskSubtype: item.taskSubtype ? JSON.parse(item.taskSubtype as string) : null
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
      if (contents.status === 'done') {
        updateData.doneAt = new Date()
      }
      if (contents.status !== 'done') {
        updateData.doneAt = null
      }
    }
    if (contents.projectId !== undefined) {
      updateData.projectId = contents.projectId
    }

    if (contents.taskTypeId !== undefined) {
      updateData.taskTypeId = contents.taskTypeId
      if (contents.taskSubtypeId === undefined) {
        updateData.taskSubtypeId = null
      }
    }
    if (contents.taskSubtypeId !== undefined) {
      if (contents.taskSubtypeId !== null) {
        const currentTask = await this.get(id)
        const targetTaskTypeId = contents.taskTypeId || currentTask.taskTypeId

        if (targetTaskTypeId) {
          const subtype = this.db
            .select()
            .from(taskSubtypes)
            .where(and(eq(taskSubtypes.id, contents.taskSubtypeId), isNull(taskSubtypes.deletedAt)))
            .get()

          if (subtype && subtype.taskTypeId !== targetTaskTypeId) {
            throw new Error('Task subtype does not belong to the specified task type')
          }
        }
      }
      updateData.taskSubtypeId = contents.taskSubtypeId
    }

    if (contents.startTime !== undefined) {
      updateData.startTime = contents.startTime ? new Date(contents.startTime) : undefined
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
