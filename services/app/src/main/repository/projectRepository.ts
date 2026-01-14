import { normalizeName } from '../../utils/utils'
import type { CreateProjectRequest, UpdateProjectRequest } from '../../shared/types'
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import * as schema from '../database/schema'
import { InsertProject, Project, projects } from '../database/schema'
import { and, eq, isNull, sql } from 'drizzle-orm'

export class ProjectRepository {
  constructor(private db: BetterSQLite3Database<typeof schema>) {}

  create(project: CreateProjectRequest): Project {
    const name = normalizeName(project.name)

    const existingProject = this.db.select().from(projects).where(eq(projects.name, name)).get()

    if (existingProject) {
      if (existingProject.deletedAt) {
        const restored = this.db
          .update(projects)
          .set({
            color: project.color ?? 'blue',
            deletedAt: null
          })
          .where(eq(projects.id, existingProject.id))
          .returning()
          .get()

        return restored
      } else {
        throw new Error(`Project with name "${name}" already exists`)
      }
    }

    const insertData: InsertProject = {
      name,
      color: project.color ?? 'blue'
    }

    const newProject = this.db.insert(projects).values(insertData).returning().get()

    return newProject
  }

  get(id: string): Project | null {
    const project = this.db
      .select()
      .from(projects)
      .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
      .get()

    return project ?? null
  }

  getAll(): Project[] {
    const projectList = this.db.select().from(projects).where(isNull(projects.deletedAt)).all()

    return projectList
  }

  update(id: string, contents: UpdateProjectRequest): Project {
    const updateData: Partial<InsertProject> = {}

    if (contents.name !== undefined) {
      updateData.name = normalizeName(contents.name)
    }

    if (contents.color !== undefined) {
      updateData.color = contents.color
    }

    const updatedProject = this.db
      .update(projects)
      .set(updateData)
      .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
      .returning()
      .get()

    if (!updatedProject) {
      throw new Error('Project not found or no changes made')
    }

    return updatedProject
  }

  softDelete(id: string): void {
    const result = this.db
      .update(projects)
      .set({ deletedAt: sql`(datetime('now'))` })
      .where(and(eq(projects.id, id), isNull(projects.deletedAt)))
      .run()

    if (result.changes === 0) {
      throw new Error('Project not found')
    }
  }
}
