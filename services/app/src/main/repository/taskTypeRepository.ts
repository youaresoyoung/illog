import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from '../database/schema/index'
import {
  CreateTaskSubtypeRequest,
  CreateTaskTypeRequest,
  TaskTypeWithSubtypesDto,
  UpdateTaskSubtypeRequest,
  UpdateTaskTypeRequest
} from '../../shared/types/taskTypeDto'
import {
  TaskType,
  taskTypes,
  InsertTaskType,
  taskSubtypes,
  TaskSubtype,
  InsertTaskSubtype
} from '../database/schema'
import { normalizeName } from '../../utils/utils'
import { and, asc, eq, isNull, sql } from 'drizzle-orm'

export class TaskTypeRepository {
  constructor(private db: BetterSQLite3Database<typeof schema>) {}

  create(data: CreateTaskTypeRequest): TaskType {
    const name = normalizeName(data.name)

    const existing = this.db.select().from(taskTypes).where(eq(taskTypes.name, name)).get()

    if (existing) {
      if (existing.deletedAt) {
        const restored = this.db
          .update(taskTypes)
          .set({ color: data.color ?? existing.color, deletedAt: null })
          .where(eq(taskTypes.id, existing.id))
          .returning()
          .get()
        return restored
      }
      throw new Error(`Task type with name ${name} already exists`)
    }

    const insertData: InsertTaskType = {
      name,
      color: data.color ?? 'blue'
    }

    const newTaskType = this.db.insert(taskTypes).values(insertData).returning().get()

    return newTaskType
  }

  get(id: string): TaskType | null {
    const taskType = this.db
      .select()
      .from(taskTypes)
      .where(and(eq(taskTypes.id, id), isNull(taskTypes.deletedAt)))
      .get()
    return taskType ?? null
  }

  getAll(): TaskType[] {
    return this.db
      .select()
      .from(taskTypes)
      .where(isNull(taskTypes.deletedAt))
      .orderBy(asc(taskTypes.createdAt))
      .all()
  }

  getAllWithSubtypes(): TaskTypeWithSubtypesDto[] {
    const types = this.getAll()

    const allSubtypes = this.db
      .select()
      .from(taskSubtypes)
      .where(isNull(taskSubtypes.deletedAt))
      .orderBy(asc(taskSubtypes.createdAt))
      .all()

    const subtypesByTypeId = new Map<string, TaskSubtype[]>()
    for (const subtype of allSubtypes) {
      const list = subtypesByTypeId.get(subtype.taskTypeId) ?? []
      list.push(subtype)
      subtypesByTypeId.set(subtype.taskTypeId, list)
    }

    return types.map((type) => ({
      ...type,
      subtypes: subtypesByTypeId.get(type.id) ?? []
    }))
  }

  update(id: string, data: UpdateTaskTypeRequest): TaskType {
    const existing = this.get(id)

    if (!existing) {
      throw new Error(`Task type with id ${id} not found`)
    }

    const updateData: Partial<InsertTaskType> = {}

    if (data.name !== undefined) {
      updateData.name = normalizeName(data.name)
    }

    if (data.color !== undefined) {
      updateData.color = data.color
    }

    const updated = this.db
      .update(taskTypes)
      .set(updateData)
      .where(eq(taskTypes.id, id))
      .returning()
      .get()

    if (!updated) {
      throw new Error(`Failed to update task type with id ${id}`)
    }

    return updated
  }

  softDelete(id: string): void {
    const existing = this.get(id)

    if (!existing) {
      throw new Error(`Task type with id ${id} not found`)
    }

    const result = this.db
      .update(taskTypes)
      .set({ deletedAt: sql`(unixepoch())` })
      .where(and(eq(taskTypes.id, id), isNull(taskTypes.deletedAt)))
      .run()

    if (result.changes === 0) {
      throw new Error(`Failed to delete task type with id ${id}`)
    }

    this.db
      .update(taskSubtypes)
      .set({ deletedAt: sql`(unixepoch())` })
      .where(and(eq(taskSubtypes.taskTypeId, id), isNull(taskSubtypes.deletedAt)))
      .run()
  }

  getSubtypes(taskTypeId: string): TaskSubtype[] {
    return this.db
      .select()
      .from(taskSubtypes)
      .where(and(eq(taskSubtypes.taskTypeId, taskTypeId), isNull(taskSubtypes.deletedAt)))
      .orderBy(asc(taskSubtypes.createdAt))
      .all()
  }

  getSubtype(id: string): TaskSubtype | null {
    const subtype = this.db
      .select()
      .from(taskSubtypes)
      .where(and(eq(taskSubtypes.id, id), isNull(taskSubtypes.deletedAt)))
      .get()
    return subtype ?? null
  }

  createSubtype(data: CreateTaskSubtypeRequest): TaskSubtype {
    const name = normalizeName(data.name)

    const parentType = this.get(data.taskTypeId)
    if (!parentType) {
      throw new Error(`Parent task type with id ${data.taskTypeId} not found`)
    }

    const existing = this.db
      .select()
      .from(taskSubtypes)
      .where(and(eq(taskSubtypes.taskTypeId, data.taskTypeId), eq(taskSubtypes.name, name)))
      .get()

    if (existing) {
      if (existing.deletedAt) {
        const restored = this.db
          .update(taskSubtypes)
          .set({ deletedAt: null })
          .where(eq(taskSubtypes.id, existing.id))
          .returning()
          .get()

        return restored
      } else {
        throw new Error(
          `Task subtype with name ${name} already exists for task type ${parentType.name}`
        )
      }
    }

    const insertData: InsertTaskSubtype = {
      taskTypeId: data.taskTypeId,
      name
    }

    const newSubtype = this.db.insert(taskSubtypes).values(insertData).returning().get()

    return newSubtype
  }

  updateSubtype(id: string, data: UpdateTaskSubtypeRequest): TaskSubtype {
    const existing = this.getSubtype(id)

    if (!existing) {
      throw new Error(`Task subtype with id ${id} not found`)
    }

    const updateData: Partial<InsertTaskSubtype> = {}

    if (data.name !== undefined) {
      updateData.name = normalizeName(data.name)
    }

    const updated = this.db
      .update(taskSubtypes)
      .set(updateData)
      .where(eq(taskSubtypes.id, id))
      .returning()
      .get()

    if (!updated) {
      throw new Error(`Failed to update task subtype with id ${id}`)
    }

    return updated
  }

  softDeleteSubtype(id: string): void {
    const existing = this.getSubtype(id)

    if (!existing) {
      throw new Error(`Task subtype with id ${id} not found`)
    }

    const result = this.db
      .update(taskSubtypes)
      .set({ deletedAt: sql`(unixepoch())` })
      .where(and(eq(taskSubtypes.id, id), isNull(taskSubtypes.deletedAt)))
      .run()

    if (result.changes === 0) {
      throw new Error(`Failed to delete task subtype with id ${id}`)
    }
  }

  validateSubtypeBelongsToType(subtypeId: string, typeId: string): boolean {
    const subtype = this.getSubtype(subtypeId)

    return subtype?.taskTypeId === typeId
  }
}
