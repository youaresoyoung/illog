import { HTMLAttributes, MouseEvent } from 'react'

export type ProjectColor = 'blue' | 'gray' | 'green' | 'purple' | 'red' | 'yellow'

export type ProjectType = {
  id: string
  name: string
  color: ProjectColor
  createdAt: Date | string
  updatedAt: Date | string | null
  deletedAt: Date | string | null
}

export type OmittedProject = Omit<ProjectType, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>

export type ProjectBadgeProps = {
  project: ProjectType | OmittedProject
  addButtonVariant?: 'default' | 'error'
  isOpenedSelector?: boolean
  openProjectSelector?: (e: MouseEvent<HTMLButtonElement>) => void
  onRemove?: () => void
} & HTMLAttributes<HTMLSpanElement>
