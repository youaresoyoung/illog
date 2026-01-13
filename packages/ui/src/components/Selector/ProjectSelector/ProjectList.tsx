import * as style from '../selector.css'
import { RefObject, useState, useRef, useCallback, useEffect, memo } from 'react'
import { Icon } from '../../Icon'
import { Portal } from '../../Portal'
import { ProjectType, ProjectColor, OmittedProject, ProjectBadge } from '../../ProjectBadge'
import { ProjectEditor } from './ProjectEditor'

type Props = {
  projects: ProjectType[]
  searchTerm: string
  canCreateNew: boolean
  previewColor: ProjectColor
  onSelect: (project: ProjectType) => Promise<void>
  onCreate: () => Promise<void>
  onDeleteProject: (projectId: string) => Promise<void>
  onUpdateProject: (projectId: string, contents: Partial<OmittedProject>) => Promise<void>
  portalContainerRef?: RefObject<Element | DocumentFragment | null>
}

const ProjectListBase = ({
  projects,
  searchTerm,
  canCreateNew,
  previewColor,
  onSelect,
  onCreate,
  onDeleteProject,
  onUpdateProject,
  portalContainerRef
}: Props) => {
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editorPosition, setEditorPosition] = useState<{ left: number; top: number } | null>(null)
  const moreBtnRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const editorRef = useRef<HTMLDivElement | null>(null)

  const updateSelectorPosition = useCallback((projectId: string | null) => {
    if (!projectId) return
    const btn = moreBtnRefs.current[projectId]
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    setEditorPosition({
      top: rect.bottom + 8,
      left: rect.left
    })
  }, [])

  const handleMoreClick = (projectId: string) => {
    setEditingProjectId(projectId)
  }

  const handleCloseEditor = () => {
    setEditingProjectId(null)
    setEditorPosition(null)
  }

  useEffect(() => {
    if (!editingProjectId) return
    updateSelectorPosition(editingProjectId)

    const handleScroll = () => updateSelectorPosition(editingProjectId)
    const handleResize = () => updateSelectorPosition(editingProjectId)

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [editingProjectId, updateSelectorPosition])

  useEffect(() => {
    if (!editingProjectId) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        editorRef.current &&
        !editorRef.current.contains(target) &&
        !moreBtnRefs.current[editingProjectId]?.contains(target)
      ) {
        handleCloseEditor()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editingProjectId])

  return (
    <div className={style.tagListContainer}>
      <p className={style.tagListDescription}>Select project or create one</p>
      {canCreateNew ? (
        <button type="button" onClick={onCreate} className={style.createNewTagButton}>
          Create{' '}
          <ProjectBadge
            project={{ id: 'preview', name: searchTerm || 'new project', color: previewColor }}
          />
        </button>
      ) : (
        <ul className={style.tagList}>
          {/* eslint-disable-next-line react-hooks/refs */}
          {projects.map((project) => (
            <li className={style.tagItem} key={project.id} onClick={() => onSelect(project)}>
              <ProjectBadge project={project} />
              <button
                className={style.moreButton}
                type="button"
                tabIndex={-1}
                aria-label="edit project"
                ref={(el) => {
                  moreBtnRefs.current[project.id] = el
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleMoreClick(project.id)
                }}
              >
                <Icon name="more" size="large" />
              </button>
              {editingProjectId === project.id && editorPosition && (
                <Portal container={portalContainerRef?.current ?? undefined}>
                  <div
                    ref={editorRef}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    style={{
                      position: 'fixed',
                      left: editorPosition.left,
                      top: editorPosition.top,
                      zIndex: 9999
                    }}
                  >
                    <ProjectEditor
                      project={project}
                      onDelete={onDeleteProject}
                      onChange={onUpdateProject}
                      onCloseEditor={handleCloseEditor}
                    />
                  </div>
                </Portal>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const ProjectList = memo(ProjectListBase)
ProjectList.displayName = 'ProjectList'
