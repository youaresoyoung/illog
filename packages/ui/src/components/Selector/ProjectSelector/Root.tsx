import { ReactNode, useCallback, useMemo, useRef, useState } from 'react'
import { ProjectSelectorContext } from './context'
import { OmittedProject, ProjectColor, ProjectType } from '../../ProjectBadge/types'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { pickRandomColor } from '../../../utils/color'

type RootProps = {
  children: ReactNode
  projects: ProjectType[]
  selectedProject: ProjectType | null
  maxNameLength?: number
  onSelectProject: (projectId: string) => Promise<void>
  onClearProject: () => Promise<void>
  onCreateProject: (data: Partial<OmittedProject>) => Promise<string>
  onDeleteProject: (projectId: string) => Promise<void>
  onUpdateProject: (projectId: string, data: Partial<OmittedProject>) => Promise<void>
}

export const Root = ({
  children,
  projects,
  selectedProject,
  maxNameLength = 100,
  onSelectProject,
  onClearProject,
  onCreateProject,
  onDeleteProject,
  onUpdateProject
}: RootProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [previewColor, setPreviewColor] = useState<ProjectColor>(
    () => pickRandomColor() as ProjectColor
  )

  const triggerRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const normalizedSearch = searchTerm.toLowerCase()

  const filteredProjects = useMemo(
    () => projects.filter((project) => project.name.toLowerCase().includes(normalizedSearch)),
    [projects, normalizedSearch]
  )

  const canCreateNew = useMemo(() => {
    const trimmed = searchTerm.trim()
    if (!trimmed) return false
    if (trimmed.length > maxNameLength) return false
    const exists = projects.some((project) => project.name.toLowerCase() === normalizedSearch)
    return !exists
  }, [searchTerm, maxNameLength, projects, normalizedSearch])

  // 바깥 클릭 감지
  useClickOutside({
    refs: [triggerRef, contentRef],
    excludeSelectors: ['[data-project-editor-root]'],
    onClickOutside: () => {
      setSearchTerm('')
      setIsOpen(false)
    },
    enabled: isOpen
  })

  const selectProject = useCallback(
    async (project: ProjectType) => {
      await onSelectProject(project.id)
      setSearchTerm('')
      setIsOpen(false)
    },
    [onSelectProject]
  )

  const clearProject = useCallback(async () => {
    await onClearProject()
  }, [onClearProject])

  const createProject = useCallback(async () => {
    if (!canCreateNew) return
    const id = await onCreateProject({ name: searchTerm.trim(), color: previewColor })
    await onSelectProject(id)
    setSearchTerm('')
    setPreviewColor(pickRandomColor() as ProjectColor)
    setIsOpen(false)
  }, [canCreateNew, onCreateProject, onSelectProject, searchTerm, previewColor])

  const deleteProject = useCallback(
    async (projectId: string) => {
      await onDeleteProject(projectId)
      if (selectedProject?.id === projectId) {
        await onClearProject()
      }
    },
    [onDeleteProject, selectedProject, onClearProject]
  )

  const updateProject = useCallback(
    async (projectId: string, data: Partial<OmittedProject>) => {
      await onUpdateProject(projectId, data)
    },
    [onUpdateProject]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && canCreateNew) {
        e.preventDefault()
        void createProject()
      } else if (e.key === 'Backspace' && !searchTerm && selectedProject) {
        void clearProject()
      } else if (e.key === 'Escape') {
        setSearchTerm('')
        setIsOpen(false)
      }
    },
    [canCreateNew, createProject, searchTerm, selectedProject, clearProject]
  )

  const contextValue = useMemo(
    () => ({
      isOpen,
      searchTerm,
      selectedProject,
      filteredProjects,
      canCreateNew,
      previewColor,
      triggerRef,
      contentRef,
      inputRef,
      setIsOpen,
      setSearchTerm,
      selectProject,
      clearProject,
      createProject,
      deleteProject,
      updateProject,
      handleKeyDown
    }),
    [
      isOpen,
      searchTerm,
      selectedProject,
      filteredProjects,
      canCreateNew,
      previewColor,
      selectProject,
      clearProject,
      createProject,
      deleteProject,
      updateProject,
      handleKeyDown
    ]
  )

  return (
    <ProjectSelectorContext.Provider value={contextValue}>
      {children}
    </ProjectSelectorContext.Provider>
  )
}
