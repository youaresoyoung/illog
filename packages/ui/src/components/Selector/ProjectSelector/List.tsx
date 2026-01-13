import { useProjectSelectorContext } from './context'
import { ProjectList } from './ProjectList'

export const List = () => {
  const {
    filteredProjects,
    searchTerm,
    canCreateNew,
    previewColor,
    selectProject,
    createProject,
    deleteProject,
    updateProject,
    contentRef
  } = useProjectSelectorContext()

  return (
    <ProjectList
      projects={filteredProjects}
      searchTerm={searchTerm}
      canCreateNew={canCreateNew}
      previewColor={previewColor}
      onSelect={selectProject}
      onCreate={createProject}
      onDeleteProject={deleteProject}
      onUpdateProject={updateProject}
      portalContainerRef={contentRef}
    />
  )
}
