import { eq, sql } from 'drizzle-orm'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from '../database/schema'
import { weeklyReflections } from '../database/schema'
import type {
  UpdateWeeklyReflectionRequest,
  WeeklyReflectionResponse,
  AccomplishmentItem
} from '../../shared/types'

export class WeeklyReflectionRepository {
  constructor(private db: BetterSQLite3Database<typeof schema>) {}

  findByWeekId(weekId: string): WeeklyReflectionResponse | null {
    const reflection = this.db
      .select()
      .from(weeklyReflections)
      .where(eq(weeklyReflections.weekId, weekId))
      .get()

    if (!reflection) {
      return null
    }

    return this.parseReflection(reflection)
  }

  create(weekId: string, data: UpdateWeeklyReflectionRequest): WeeklyReflectionResponse {
    const result = this.db
      .insert(weeklyReflections)
      .values({
        weekId,
        accomplishments: JSON.stringify(data.accomplishments ?? []),
        improvements: JSON.stringify(data.improvements ?? []),
        nextWeekFocus: JSON.stringify(data.nextWeekFocus ?? [])
      })
      .returning()
      .get()

    if (!result) {
      throw new Error('Failed to create weekly reflection')
    }

    return this.parseReflection(result)
  }

  update(weekId: string, data: UpdateWeeklyReflectionRequest): WeeklyReflectionResponse {
    const updateData: Record<string, unknown> = {
      updatedAt: sql`(datetime('now'))`
    }

    if (data.accomplishments !== undefined) {
      updateData.accomplishments = JSON.stringify(data.accomplishments)
    }
    if (data.improvements !== undefined) {
      updateData.improvements = JSON.stringify(data.improvements)
    }
    if (data.nextWeekFocus !== undefined) {
      updateData.nextWeekFocus = JSON.stringify(data.nextWeekFocus)
    }

    const result = this.db
      .update(weeklyReflections)
      .set(updateData)
      .where(eq(weeklyReflections.weekId, weekId))
      .returning()
      .get()

    if (!result) {
      throw new Error('Weekly reflection not found')
    }

    return this.parseReflection(result)
  }

  upsert(weekId: string, data: UpdateWeeklyReflectionRequest): WeeklyReflectionResponse {
    const existing = this.findByWeekId(weekId)

    if (existing) {
      return this.update(weekId, data)
    }

    return this.create(weekId, data)
  }

  private parseReflection(
    reflection: typeof weeklyReflections.$inferSelect
  ): WeeklyReflectionResponse {
    return {
      id: reflection.id,
      weekId: reflection.weekId,
      accomplishments: JSON.parse(reflection.accomplishments) as AccomplishmentItem[],
      improvements: JSON.parse(reflection.improvements) as string[],
      nextWeekFocus: JSON.parse(reflection.nextWeekFocus) as string[],
      createdAt: reflection.createdAt.toISOString(),
      updatedAt: reflection.updatedAt.toISOString()
    }
  }
}
