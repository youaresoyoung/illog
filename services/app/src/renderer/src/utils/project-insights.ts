import type { BadgeColor } from '@illog/ui'
import type { TaskWithTags } from '../../../shared/types'
import { getTaskDurationMinutes } from './this-week-stats'

export interface ProjectOverviewMetrics {
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  todoTasks: number
  completionRate: number // percentage
  totalMinutesSpent: number
}

export interface TaskTypeMetrics {
  id: string
  name: string
  color: BadgeColor
  count: number
  completionRate: number
  avgCompletionMinutes: number | null
  totalMinutes: number
}

export interface SubtypeMetrics {
  id: string
  name: string
  color: BadgeColor
  taskTypeId: string
  taskTypeName: string
  taskTypeColor: BadgeColor
  count: number
  completionRate: number
  totalMinutes: number
}

/**
 * Calculate lead time in minutes from createdAt to doneAt
 * Returns null if task is not completed (doneAt is null)
 */
function calculateLeadTime(task: TaskWithTags): number | null {
  if (!task.doneAt) return null
  const created = new Date(task.createdAt).getTime()
  const done = new Date(task.doneAt).getTime()
  return Math.max(0, Math.floor((done - created) / (1000 * 60))) // minutes
}

/**
 * Calculate project overview metrics
 */
export function calculateProjectOverview(tasks: TaskWithTags[]): ProjectOverviewMetrics {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.status === 'done').length
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length
  const todoTasks = tasks.filter((t) => t.status === 'todo').length

  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  // Calculate average lead time for completed tasks
  const totalMinutesSpent = tasks.reduce((sum, task) => sum + getTaskDurationMinutes(task), 0)

  return {
    totalTasks,
    completedTasks,
    inProgressTasks,
    todoTasks,
    completionRate,
    totalMinutesSpent
  }
}

/**
 * Calculate task type metrics including distribution and performance
 */
export function calculateTaskTypeMetrics(tasks: TaskWithTags[]): TaskTypeMetrics[] {
  const typeMap = new Map<
    string,
    {
      id: string
      name: string
      color: BadgeColor
      count: number
      completed: number
      leadTimes: number[]
      totalMinutes: number
    }
  >()

  // Aggregate by task type
  for (const task of tasks) {
    const id = task.taskType?.id ?? 'uncategorized'
    const name = task.taskType?.name ?? 'Uncategorized'
    const color = task.taskType?.color ?? 'gray'

    let entry = typeMap.get(id)
    if (!entry) {
      entry = { id, name, color, count: 0, completed: 0, leadTimes: [], totalMinutes: 0 }
      typeMap.set(id, entry)
    }

    entry.count += 1
    entry.totalMinutes += getTaskDurationMinutes(task)
    if (task.status === 'done') {
      entry.completed += 1
      const leadTime = calculateLeadTime(task)
      if (leadTime !== null) {
        entry.leadTimes.push(leadTime)
      }
    }
  }

  // Convert to metrics array
  return Array.from(typeMap.values()).map((entry) => ({
    id: entry.id,
    name: entry.name,
    color: entry.color,
    count: entry.count,
    completionRate: entry.count > 0 ? (entry.completed / entry.count) * 100 : 0,
    avgCompletionMinutes:
      entry.leadTimes.length > 0
        ? entry.leadTimes.reduce((sum, t) => sum + t, 0) / entry.leadTimes.length
        : null,
    totalMinutes: entry.totalMinutes
  }))
}

/**
 * Calculate subtype metrics for deep analysis
 */
export function calculateSubtypeMetrics(tasks: TaskWithTags[]): SubtypeMetrics[] {
  const subtypeMap = new Map<
    string,
    {
      id: string
      name: string
      color: BadgeColor
      taskTypeId: string
      taskTypeName: string
      taskTypeColor: BadgeColor
      count: number
      completed: number
      leadTimes: number[]
      totalMinutes: number
    }
  >()
  // Aggregate by subtype
  for (const task of tasks) {
    if (!task.taskSubtype) continue

    const id = task.taskSubtype.id
    const name = task.taskSubtype.name
    const color = task.taskSubtype.color ?? 'gray'
    const taskTypeId = task.taskType?.id ?? 'unknown'
    const taskTypeName = task.taskType?.name ?? 'Unknown'
    const taskTypeColor = task.taskType?.color ?? 'gray'

    let entry = subtypeMap.get(id)
    if (!entry) {
      entry = {
        id,
        name,
        color,
        taskTypeId,
        taskTypeName,
        taskTypeColor,
        count: 0,
        completed: 0,
        leadTimes: [],
        totalMinutes: 0
      }
      subtypeMap.set(id, entry)
    }

    entry.count += 1
    entry.totalMinutes += getTaskDurationMinutes(task)
    if (task.status === 'done') {
      entry.completed += 1
      const leadTime = calculateLeadTime(task)
      if (leadTime !== null) {
        entry.leadTimes.push(leadTime)
      }
    }
  }

  // Convert to metrics array
  return Array.from(subtypeMap.values())
    .map((entry) => ({
      id: entry.id,
      name: entry.name,
      color: entry.color,
      taskTypeId: entry.taskTypeId,
      taskTypeName: entry.taskTypeName,
      taskTypeColor: entry.taskTypeColor,
      count: entry.count,
      completionRate: entry.count > 0 ? (entry.completed / entry.count) * 100 : 0,
      totalMinutes: entry.totalMinutes
    }))
    .sort((a, b) => b.count - a.count) // Sort by count descending
}
