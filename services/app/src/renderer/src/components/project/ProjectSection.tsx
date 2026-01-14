import { useMemo } from 'react'
import {
  Stack,
  ProjectBadge,
  ProjectSelector,
  Divider,
  useProjectSelectorContext,
  type ProjectType,
  type OmittedProject
} from '@illog/ui'
import {
  useAllProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject
} from '../../hooks/queries/useProjectQueries'
import { useSetProjectToTask, useClearProjectFromTask } from '../../hooks/queries/useTaskQueries'
import type {
  TaskWithTags,
  CreateProjectRequest,
  UpdateProjectRequest
} from '../../../../shared/types'

const ProjectBadgeTrigger = ({ project }: { project: ProjectType | null }) => {
  const { isOpen } = useProjectSelectorContext()

  return (
    <Stack minW="0" overflow="hidden">
      {project ? (
        <ProjectBadge project={project} isOpenedSelector={isOpen} />
      ) : (
        <ProjectBadge
          project={{ name: 'Add Project', color: 'gray' }}
          isOpenedSelector={isOpen}
          addButtonVariant={'default'}
        />
      )}
    </Stack>
  )
}

export const ProjectSection = ({ task }: { task: TaskWithTags }) => {
  const { data: projects = [] } = useAllProjects()
  const { mutateAsync: createProject } = useCreateProject()
  const { mutateAsync: updateProject } = useUpdateProject()
  const { mutateAsync: deleteProject } = useDeleteProject()
  const { mutateAsync: setProject } = useSetProjectToTask()
  const { mutateAsync: clearProject } = useClearProjectFromTask()

  const projectList = useMemo(() => projects as ProjectType[], [projects])

  const selectedProject = useMemo(() => {
    if (!task.project) return null
    const found = projects.find((p) => p.id === task.project?.id)
    if (found) {
      return found as ProjectType
    }
    return task.project as ProjectType
  }, [task.project, projects])

  const handleSelectProject = async (projectId: string) => {
    await setProject({ taskId: task.id, projectId })
  }

  const handleClearProject = async () => {
    await clearProject(task.id)
  }

  const handleCreateProject = async (data: Partial<OmittedProject>) => {
    if (!data.name) throw new Error('Project name is required')
    const newProject = await createProject({
      name: data.name,
      color: data.color
    } as CreateProjectRequest)
    return newProject.id
  }

  const handleUpdateProject = async (projectId: string, data: Partial<OmittedProject>) => {
    await updateProject({ id: projectId, data: data as UpdateProjectRequest })
  }

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId)
  }

  return (
    <ProjectSelector.Root
      projects={projectList}
      selectedProject={selectedProject}
      onSelectProject={handleSelectProject}
      onClearProject={handleClearProject}
      onCreateProject={handleCreateProject}
      onDeleteProject={handleDeleteProject}
      onUpdateProject={handleUpdateProject}
    >
      <ProjectSelector.Trigger asChild>
        <ProjectBadgeTrigger project={selectedProject} />
      </ProjectSelector.Trigger>

      <ProjectSelector.Content>
        <ProjectSelector.Search placeholder="Search projects..." />
        <Divider />
        <ProjectSelector.List />
      </ProjectSelector.Content>
    </ProjectSelector.Root>
  )
}
