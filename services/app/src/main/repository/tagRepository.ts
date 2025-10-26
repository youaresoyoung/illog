import { Database } from 'better-sqlite3'
import { OmittedTag, Tag } from '../../types'
import { randomUUID } from 'crypto'
import { normalizeName } from '../../utils/utils'

export class TagReposity {
  constructor(private db: Database) {}

  create(tag: Partial<OmittedTag>): Tag {
    const now = new Date().toISOString()
    const name = normalizeName(tag.name ?? 'Untitled')
    const color = tag.color ?? 'gray'

    const existingTag = this.db.prepare(`SELECT * FROM tag WHERE name = :name`).get({ name }) as
      | Tag
      | undefined

    if (existingTag) {
      if (existingTag.deleted_at) {
        const stmt = this.db.prepare(
          `UPDATE tag SET color = :color, updated_at = :updated_at, deleted_at = NULL 
           WHERE id = :id`
        )
        stmt.run({ id: existingTag.id, color, updated_at: now })
        return this.get(existingTag.id)!
      } else {
        throw new Error(`Tag with name "${name}" already exists`)
      }
    }

    const id = randomUUID()
    const stmt = this.db.prepare(
      `INSERT INTO tag (id, name, color, created_at, updated_at, deleted_at) 
       VALUES (:id, :name, :color, :created_at, :updated_at, :deleted_at)`
    )

    stmt.run({ id, name, color, created_at: now, updated_at: now, deleted_at: null })
    return this.get(id)!
  }

  get(id: string): Tag | null {
    const stmt = this.db.prepare(`SELECT * FROM tag WHERE id = :id AND deleted_at IS NULL`)
    return (stmt.get({ id }) as Tag) ?? null
  }

  getAll(): Tag[] {
    const stmt = this.db.prepare(`SELECT * FROM tag WHERE deleted_at IS NULL`)
    return (stmt.all() as Tag[]) ?? []
  }

  update(id: string, contents: Partial<OmittedTag>): Tag {
    const now = new Date().toISOString()

    const updates: string[] = []
    const params: Record<string, unknown> = { id, updated_at: now }

    if (contents.name !== undefined) {
      const normalizedName = normalizeName(contents.name)
      updates.push('name = :name')
      params.name = normalizedName
    }

    if (contents.color !== undefined) {
      updates.push('color = :color')
      params.color = contents.color
    }

    updates.push('updated_at = :updated_at')

    if (updates.length === 1) {
      return this.get(id)!
    }

    const query = `UPDATE tag SET ${updates.join(', ')} WHERE id = :id AND deleted_at IS NULL`
    const stmt = this.db.prepare(query)
    stmt.run(params)

    return this.get(id)!
  }

  softDelete(id: string) {
    const stmt = this.db.prepare(
      `UPDATE tag SET deleted_at = :now WHERE id = :id AND deleted_at IS NULL`
    )
    stmt.run({ id, now: new Date().toISOString() })
  }
}
