import { useMemo, useEffect } from 'react'
import { useAllProjects, useProject } from './queries/useProjectQueries'
import { useTasksByFilters } from './queries/useTaskQueries'
import { useUIStore } from '../stores/useUIStore'
import {
  calculateProjectOverview,
  calculateTaskTypeMetrics,
  calculateSubtypeMetrics
} from '../utils/project-insights'
import type { TaskFilterParams } from '../../../shared/types'

const selectProjectId = (s: { currentSelectedProjectId: string | undefined }) =>
  s.currentSelectedProjectId
const selectSetProjectId = (s: { setCurrentSelectedProjectId: (id: string) => void }) =>
  s.setCurrentSelectedProjectId

export function useProjects() {
  const selectedProjectId = useUIStore(selectProjectId)
  const setSelectedProjectId = useUIStore(selectSetProjectId)

  const { data: projects = [], isLoading: isProjectsLoading } = useAllProjects()
  const { data: project } = useProject(selectedProjectId ?? '')

  // Auto-select first project if none selected
  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id)
    }
  }, [projects, selectedProjectId, setSelectedProjectId])

  const taskFilters = useMemo<TaskFilterParams>(
    () => ({ projectId: selectedProjectId ?? undefined }),
    [selectedProjectId]
  )

  const { data: tasks = [], isLoading: isTasksLoading, error } = useTasksByFilters(taskFilters)

  const overviewMetrics = useMemo(() => calculateProjectOverview(tasks), [tasks])
  const taskTypeMetrics = useMemo(() => calculateTaskTypeMetrics(tasks), [tasks])
  const subtypeMetrics = useMemo(() => calculateSubtypeMetrics(tasks), [tasks])

  const isLoading = isProjectsLoading || isTasksLoading

  return {
    projects,
    selectedProjectId,
    setSelectedProjectId,
    project,

    tasks,
    isLoading,
    error,

    overviewMetrics,
    taskTypeMetrics,
    subtypeMetrics
  } as const
}
