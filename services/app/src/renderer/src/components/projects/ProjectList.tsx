import { memo, useMemo } from 'react'
import { Stack } from '@illog/ui'
import { useAllProjects, useAllTasks } from '../../hooks/queries'
import { calculateProjectOverview } from '../../utils/project-insights'
import { useUIStore } from '../../stores/useUIStore'
import { ProjectItem } from './ProjectItem'

const selectProjectId = (s: { currentSelectedProjectId: string | undefined }) =>
  s.currentSelectedProjectId
const selectSetProjectId = (s: { setCurrentSelectedProjectId: (id: string) => void }) =>
  s.setCurrentSelectedProjectId

export const ProjectList = memo(() => {
  const { data: projects = [] } = useAllProjects()
  const { data: allTasks = [] } = useAllTasks()

  const selectedProjectId = useUIStore(selectProjectId)
  const setSelectedProjectId = useUIStore(selectSetProjectId)

  const projectsWithMetrics = useMemo(() => {
    const tasksByProject = new Map<string, typeof allTasks>()
    for (const task of allTasks) {
      const pid = task.projectId
      if (!pid) continue
      const list = tasksByProject.get(pid)
      if (list) {
        list.push(task)
      } else {
        tasksByProject.set(pid, [task])
      }
    }

    return projects.map((project) => ({
      project,
      overview: calculateProjectOverview(tasksByProject.get(project.id) ?? [])
    }))
  }, [projects, allTasks])

  return (
    <Stack
      as="aside"
      width={256}
      minHeight="100vh"
      p="400"
      position="fixed"
      top={0}
      left={256}
      gap="400"
      bottom={0}
      backgroundColor="backgroundDefaultSecondary"
      borderRight="border"
      borderColor="borderDefaultDefault"
      borderRightStyle="solid"
      overflowY="auto"
    >
      {projectsWithMetrics.map(({ project, overview }) => (
        <ProjectItem
          key={project.id}
          project={project}
          overview={overview}
          isSelected={project.id === selectedProjectId}
          onSelect={setSelectedProjectId}
        />
      ))}
    </Stack>
  )
})

ProjectList.displayName = 'ProjectList'
