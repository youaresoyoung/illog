import { Database } from 'better-sqlite3'
import { Tag } from '../../types'
import { randomUUID } from 'crypto'

export class TagReposity {
  constructor(private db: Database) {}

  create(tag: Partial<Tag>) {
    const id = randomUUID()
    const now = new Date().toISOString()

    const {
      name = 'Untitled',
      color = 'gray',
      created_at = now,
      updated_at = now,
      deleted_at = null
    } = tag

    const stmt = this.db.prepare(
      `INSERT INTO tag (id, name, color, created_at, updated_at, deleted_at) 
       VALUES (:id, :name, :color, :created_at, :updated_at, :deleted_at)`
    )

    stmt.run({ id, name, color, created_at, updated_at, deleted_at })

    return this.get(id)
  }

  get(id: string): Tag | null {
    const stmt = this.db.prepare(`SELECT * FROM tag WHERE id = :id AND deleted_at IS NULL`)
    const tag = stmt.get({ id }) as Tag
    return tag ?? null
  }

  getAll(): Tag[] {
    const stmt = this.db.prepare(`SELECT * FROM tag WHERE deleted_at IS NULL`)
    const tags = stmt.all() as Tag[]
    return tags ?? []
  }

  update(id: string, contents: Partial<Tag>) {
    const stmt = this.db.prepare(
      `UPDATE tag
       SET name = COALESCE(:name, name)
           color = COALESCE(:color, color)
           updated_at = COALESCE(:updated_at, updated_at)
       WHERE id = :id AND deleted_at IS NULL`
    )

    const result = stmt.run({ ...contents, updated_at: new Date().toISOString(), id })

    if (result.changes === 0) {
      throw new Error('Tag not found or no changes made')
    }

    return this.get(id)
  }

  softDelete(id: string) {
    const now = new Date().toISOString()

    const stmt = this.db.prepare(
      `UPDATE tag SET deleted_at = :now WHERE id = :id AND deleted_at IS NULL`
    )
    const row = stmt.run({ now, id })

    if (row.changes === 0) {
      throw new Error('Tag not found')
    }
  }
}
