import { createContext, useContext, RefObject } from 'react'
import { OmittedProject, ProjectColor, ProjectType } from '../../ProjectBadge/types'

export type ProjectSelectorContextValue = {
  isOpen: boolean
  searchTerm: string
  selectedProject: ProjectType | null
  filteredProjects: ProjectType[]
  canCreateNew: boolean
  previewColor: ProjectColor

  triggerRef: RefObject<HTMLElement | null>
  contentRef: RefObject<HTMLDivElement | null>
  inputRef: RefObject<HTMLInputElement | null>

  setIsOpen: (open: boolean) => void
  setSearchTerm: (term: string) => void
  selectProject: (project: ProjectType) => Promise<void>
  clearProject: () => Promise<void>
  createProject: () => Promise<void>
  deleteProject: (projectId: string) => Promise<void>
  updateProject: (projectId: string, data: Partial<OmittedProject>) => Promise<void>
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export const ProjectSelectorContext = createContext<ProjectSelectorContextValue | null>(null)

export const useProjectSelectorContext = () => {
  const context = useContext(ProjectSelectorContext)
  if (!context) {
    throw new Error('useProjectSelectorContext must be used within ProjectSelector.Root')
  }
  return context
}
