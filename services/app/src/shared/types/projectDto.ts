import type { ProjectColor } from './common'
import type { Project } from './entities'

export interface CreateProjectRequest {
  name: string
  color?: ProjectColor
}

export interface UpdateProjectRequest {
  name?: string
  color?: ProjectColor
}

export type ProjectResponse = Project

export type ProjectListResponse = Project[]
