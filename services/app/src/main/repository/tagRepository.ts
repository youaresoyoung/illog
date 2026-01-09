import { normalizeName } from '../../utils/utils'
import type { CreateTagRequest, UpdateTagRequest } from '../../shared/types'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from '../database/schema'
import { InsertTag, Tag, tags } from '../database/schema'
import { and, eq, isNull, sql } from 'drizzle-orm'

export class TagRepository {
  constructor(private db: BetterSQLite3Database<typeof schema>) {}

  create(tag: CreateTagRequest): Tag {
    const name = normalizeName(tag.name)

    const existingTag = this.db.select().from(tags).where(eq(tags.name, name)).get()

    if (existingTag) {
      if (existingTag.deletedAt) {
        const restored = this.db
          .update(tags)
          .set({
            color: tag.color,
            deletedAt: null
          })
          .where(eq(tags.id, existingTag.id))
          .returning()
          .get()

        return restored
      } else {
        throw new Error(`Tag with name "${name}" already exists`)
      }
    }

    const insertData: InsertTag = {
      name,
      color: tag.color
    }

    const newTag = this.db.insert(tags).values(insertData).returning().get()

    return newTag
  }

  get(id: string): Tag | null {
    const tag = this.db
      .select()
      .from(tags)
      .where(and(eq(tags.id, id), isNull(tags.deletedAt)))
      .get()

    return tag ?? null
  }

  getAll(): Tag[] {
    const tagsList = this.db.select().from(tags).where(isNull(tags.deletedAt)).all()

    return tagsList
  }

  update(id: string, contents: UpdateTagRequest): Tag {
    const updateData: Partial<InsertTag> = {}

    if (contents.name !== undefined) {
      updateData.name = normalizeName(contents.name)
    }

    if (contents.color !== undefined) {
      updateData.color = contents.color
    }

    const updatedTag = this.db
      .update(tags)
      .set(updateData)
      .where(and(eq(tags.id, id), isNull(tags.deletedAt)))
      .returning()
      .get()

    if (!updatedTag) {
      throw new Error('Tag not found or no changes made')
    }

    return updatedTag
  }

  softDelete(id: string): void {
    const result = this.db
      .update(tags)
      .set({ deletedAt: sql`(unixepoch())` })
      .where(and(eq(tags.id, id), isNull(tags.deletedAt)))
      .run()

    if (result.changes === 0) {
      throw new Error('Tag not found')
    }
  }
}
