import { BadgeColor } from '@illog/ui'
import type { TaskWithTags } from '../../../shared/types'
import { getTaskDurationMinutes } from './this-week-stats'

export type ChartSegment = {
  id: string
  name: string
  color: BadgeColor
  taskCount: number
  totalMinutes: number
  percentage: number
}

export type ViewMode = 'project' | 'taskType' | 'subtype'

export const ETC_SEGMENT_ID = 'etc'
export const ETC_FILTER_ID = '__etc__' as const

export type CategorySelection = {
  id: string | typeof ETC_FILTER_ID
  name: string
}

export type AnalyticsFilter = {
  viewMode: ViewMode
  selectedCategory: CategorySelection | null
  selectedSubcategory: CategorySelection | null
}

export const INITIAL_FILTER: AnalyticsFilter = {
  viewMode: 'project',
  selectedCategory: null,
  selectedSubcategory: null
}

function aggregateToSegments(
  tasks: TaskWithTags[],
  getKey: (task: TaskWithTags) => string,
  getName: (task: TaskWithTags) => string,
  getColor: (task: TaskWithTags) => BadgeColor
): ChartSegment[] {
  const map = new Map<
    string,
    { id: string; name: string; color: BadgeColor; taskCount: number; totalMinutes: number }
  >()

  let grandTotal = 0

  for (const task of tasks) {
    const id = getKey(task)
    const minutes = getTaskDurationMinutes(task)
    grandTotal += minutes

    const existing = map.get(id)
    if (existing) {
      existing.taskCount += 1
      existing.totalMinutes += minutes
    } else {
      map.set(id, {
        id,
        name: getName(task),
        color: getColor(task),
        taskCount: 1,
        totalMinutes: minutes
      })
    }
  }

  return Array.from(map.values())
    .map((entry) => ({
      ...entry,
      percentage: grandTotal > 0 ? (entry.totalMinutes / grandTotal) * 100 : 0
    }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes)
}

function groupByProject(tasks: TaskWithTags[]): ChartSegment[] {
  return aggregateToSegments(
    tasks,
    (t) => t.project?.id ?? ETC_SEGMENT_ID,
    (t) => t.project?.name ?? ETC_SEGMENT_ID,
    (t) => t.project?.color ?? 'gray'
  )
}

function groupByTaskType(tasks: TaskWithTags[]): ChartSegment[] {
  return aggregateToSegments(
    tasks,
    (t) => t.taskType?.id ?? ETC_SEGMENT_ID,
    (t) => t.taskType?.name ?? ETC_SEGMENT_ID,
    (t) => t.taskType?.color ?? 'gray'
  )
}

function groupBySubtype(tasks: TaskWithTags[]): ChartSegment[] {
  return aggregateToSegments(
    tasks,
    (t) => t.taskSubtype?.id ?? ETC_SEGMENT_ID,
    (t) => t.taskSubtype?.name ?? ETC_SEGMENT_ID,
    (t) => t.taskSubtype?.color ?? 'gray'
  )
}

function filterByProject(tasks: TaskWithTags[], id: string | '__etc__'): TaskWithTags[] {
  if (id === ETC_FILTER_ID) return tasks.filter((t) => t.project === null)
  return tasks.filter((t) => t.project?.id === id)
}

function filterByTaskType(tasks: TaskWithTags[], id: string | '__etc__'): TaskWithTags[] {
  if (id === ETC_FILTER_ID) return tasks.filter((t) => t.taskType === null)
  return tasks.filter((t) => t.taskType?.id === id)
}

function filterBySubtype(tasks: TaskWithTags[], id: string | '__etc__'): TaskWithTags[] {
  if (id === ETC_FILTER_ID) return tasks.filter((t) => t.taskSubtype === null)
  return tasks.filter((t) => t.taskSubtype?.id === id)
}

export function getStatsForFilterLevel(
  tasks: TaskWithTags[],
  filter: AnalyticsFilter
): ChartSegment[] {
  const { viewMode, selectedCategory, selectedSubcategory } = filter

  if (viewMode === 'project') {
    if (!selectedCategory) return groupByProject(tasks)
    const byProject = filterByProject(tasks, selectedCategory.id)
    if (!selectedSubcategory) return groupByTaskType(byProject)
    return groupBySubtype(filterByTaskType(byProject, selectedSubcategory.id))
  }

  if (viewMode === 'taskType') {
    if (!selectedCategory) return groupByTaskType(tasks)
    const byType = filterByTaskType(tasks, selectedCategory.id)
    if (!selectedSubcategory) return groupByProject(byType)
    return groupBySubtype(filterByProject(byType, selectedSubcategory.id))
  }

  if (!selectedCategory) return groupBySubtype(tasks)
  return groupByProject(filterBySubtype(tasks, selectedCategory.id))
}

export function isLeafLevel(filter: AnalyticsFilter): boolean {
  if (filter.viewMode === 'subtype') return filter.selectedCategory !== null
  return filter.selectedSubcategory !== null
}

export function getLevelLabel(filter: AnalyticsFilter): string {
  const { viewMode, selectedCategory, selectedSubcategory } = filter

  if (viewMode === 'project') {
    if (!selectedCategory) return 'By Project'
    if (!selectedSubcategory) return 'By Task Type'
    return 'By Subtype'
  }

  if (viewMode === 'taskType') {
    if (!selectedCategory) return 'By Task Type'
    if (!selectedSubcategory) return 'By Project'
    return 'By Subtype'
  }

  if (!selectedCategory) return 'By Subtype'
  return 'By Project'
}

export function getCategoryLabel(filter: AnalyticsFilter): string {
  const { viewMode, selectedCategory } = filter

  if (!selectedCategory) return ''

  if (viewMode === 'project') return 'Project'
  if (viewMode === 'taskType') return 'Task Type'
  return 'Subtype'
}

export function getSubcategoryLabel(filter: AnalyticsFilter): string {
  const { viewMode, selectedCategory, selectedSubcategory } = filter

  if (!selectedSubcategory) return ''

  if (viewMode === 'project') {
    return selectedCategory ? 'Task Type' : ''
  }

  if (viewMode === 'taskType') {
    return selectedCategory ? 'Project' : ''
  }

  return ''
}

export function getBreadcrumbRoot(viewMode: ViewMode): string {
  if (viewMode === 'project') return 'All Projects'
  if (viewMode === 'taskType') return 'All Task Types'
  return 'All Sub Types'
}

export function getFilteredTasks(tasks: TaskWithTags[], filter: AnalyticsFilter): TaskWithTags[] {
  const { viewMode, selectedCategory, selectedSubcategory } = filter

  let filtered = tasks

  if (viewMode === 'project') {
    if (selectedCategory) filtered = filterByProject(filtered, selectedCategory.id)
    if (selectedSubcategory) filtered = filterByTaskType(filtered, selectedSubcategory.id)
  } else if (viewMode === 'taskType') {
    if (selectedCategory) filtered = filterByTaskType(filtered, selectedCategory.id)
    if (selectedSubcategory) filtered = filterByProject(filtered, selectedSubcategory.id)
  } else {
    if (selectedCategory) filtered = filterBySubtype(filtered, selectedCategory.id)
  }

  return filtered
}
