import { Database } from 'better-sqlite3'
import { OmittedTag, Tag } from '../../types'
import { randomUUID } from 'crypto'
import { normalizeName } from '../../utils/utils'

export class TagReposity {
  constructor(private db: Database) {}

  create(tag: Partial<OmittedTag>): Tag {
    const id = randomUUID()
    const now = new Date().toISOString()
    const name = normalizeName(tag.name ?? 'Untitled')
    const color = tag.color ?? 'gray'

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
    const name = contents.name ? normalizeName(contents.name) : null
    const color = contents.color ?? null

    const stmt = this.db.prepare(
      `UPDATE tag
       SET name = COALESCE(:name, name),
           color = COALESCE(:color, color),
           updated_at = COALESCE(:updated_at, updated_at)
       WHERE id = :id AND deleted_at IS NULL`
    )

    stmt.run({
      id,
      name,
      color,
      updated_at: new Date().toISOString()
    })
    return this.get(id)!
  }

  softDelete(id: string) {
    const stmt = this.db.prepare(
      `UPDATE tag SET deleted_at = :now WHERE id = :id AND deleted_at IS NULL`
    )
    stmt.run({ id, now: new Date().toISOString() })
  }
}
