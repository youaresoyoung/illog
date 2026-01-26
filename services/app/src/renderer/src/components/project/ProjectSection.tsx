import { useMemo } from 'react'
import {
  Stack,
  Badge,
  BadgeSelector,
  Divider,
  useBadgeSelectorContext,
  type BadgeItem,
  type OmittedBadgeItem
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

const ProjectBadgeTrigger = ({ project }: { project: BadgeItem | null }) => {
  const { isOpen } = useBadgeSelectorContext()

  return (
    <Stack minW="0" overflow="hidden">
      {project ? (
        <Badge item={project} isOpenedSelector={isOpen} />
      ) : (
        <Badge
          item={{ name: 'Add Project', color: 'gray' }}
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

  const projectList = useMemo(() => projects as BadgeItem[], [projects])

  const selectedProject = useMemo(() => {
    if (!task.project) return null
    const found = projects.find((p) => p.id === task.project?.id)
    if (found) {
      return found as BadgeItem
    }
    return task.project as BadgeItem
  }, [task.project, projects])

  const handleSelectProject = async (projectId: string) => {
    await setProject({ taskId: task.id, projectId })
  }

  const handleClearProject = async () => {
    await clearProject(task.id)
  }

  const handleCreateProject = async (data: Partial<OmittedBadgeItem>) => {
    if (!data.name) throw new Error('Project name is required')
    const newProject = await createProject({
      name: data.name,
      color: data.color
    } as CreateProjectRequest)
    return newProject.id
  }

  const handleUpdateProject = async (projectId: string, data: Partial<OmittedBadgeItem>) => {
    await updateProject({ id: projectId, data: data as UpdateProjectRequest })
  }

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId)
  }

  return (
    <BadgeSelector.Root
      items={projectList}
      selectedItem={selectedProject}
      onSelectItem={handleSelectProject}
      onClearItem={handleClearProject}
      onCreateItem={handleCreateProject}
      onDeleteItem={handleDeleteProject}
      onUpdateItem={handleUpdateProject}
    >
      <BadgeSelector.Trigger asChild>
        <ProjectBadgeTrigger project={selectedProject} />
      </BadgeSelector.Trigger>

      <BadgeSelector.Content>
        <BadgeSelector.Search placeholder="Search projects..." />
        <Divider />
        <BadgeSelector.List />
      </BadgeSelector.Content>
    </BadgeSelector.Root>
  )
}
