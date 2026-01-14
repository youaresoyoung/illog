import { getWeek, getYear, format, startOfDay, isSameDay } from 'date-fns'
import type { TaskWithTags } from '../../../shared/types'
import type { TagColor } from '@illog/ui'

// ============================================
// Types
// ============================================

export interface WeeklyStats {
  completedCount: number
  totalMinutes: number
  uniqueTagCount: number
  avgTasksPerDay: number
}

export interface CategoryStats {
  tagId: string
  tagName: string
  tagColor: TagColor
  taskCount: number
  totalMinutes: number
  percentage: number
}

export interface DayTasks {
  date: Date
  dayLabel: string // "Monday, Dec 11"
  tasks: TaskWithTags[]
  totalMinutes: number
}

// ============================================
// Utility Functions
// ============================================

/**
 * Returns ISO week ID (e.g., "2024-W01")
 */
export function getWeekId(date: Date): string {
  const week = getWeek(date, { weekStartsOn: 1 })
  const year = getYear(date)
  return `${year}-W${week.toString().padStart(2, '0')}`
}

/**
 * Calculate task duration in minutes
 */
export function getTaskDurationMinutes(task: TaskWithTags): number {
  if (!task.startTime || !task.endTime) return 0

  const start = new Date(task.startTime)
  const end = new Date(task.endTime)
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60)))
}

/**
 * Format minutes as "Xh Ym" or "Xh" or "Ym"
 */
export function formatDuration(minutes: number): string {
  if (minutes === 0) return '0m'

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

/**
 * Format minutes as decimal hours (e.g., "32.5h")
 */
export function formatHoursDecimal(minutes: number): string {
  const hours = minutes / 60
  return `${hours.toFixed(1)}h`
}

// ============================================
// Statistics Calculators
// ============================================

/**
 * Calculate weekly summary statistics
 */
export function calculateWeeklyStats(tasks: TaskWithTags[]): WeeklyStats {
  const completedCount = tasks.filter((t) => t.doneAt !== null).length

  const totalMinutes = tasks.reduce((sum, task) => sum + getTaskDurationMinutes(task), 0)

  const uniqueTags = new Set(tasks.flatMap((t) => t.tags.map((tag) => tag.id)))
  const uniqueTagCount = uniqueTags.size

  const avgTasksPerDay = completedCount / 7

  return {
    completedCount,
    totalMinutes,
    uniqueTagCount,
    avgTasksPerDay
  }
}

/**
 * Calculate productivity statistics by category (tag)
 */
export function calculateCategoryStats(tasks: TaskWithTags[]): CategoryStats[] {
  const categoryMap = new Map<
    string,
    {
      tagId: string
      tagName: string
      tagColor: TagColor
      taskCount: number
      totalMinutes: number
    }
  >()

  let grandTotalMinutes = 0

  for (const task of tasks) {
    const taskMinutes = getTaskDurationMinutes(task)
    grandTotalMinutes += taskMinutes

    for (const tag of task.tags) {
      const existing = categoryMap.get(tag.id)
      if (existing) {
        existing.taskCount += 1
        existing.totalMinutes += taskMinutes
      } else {
        categoryMap.set(tag.id, {
          tagId: tag.id,
          tagName: tag.name,
          tagColor: tag.color as TagColor,
          taskCount: 1,
          totalMinutes: taskMinutes
        })
      }
    }
  }

  // Calculate percentages and sort by total time
  const stats: CategoryStats[] = Array.from(categoryMap.values())
    .map((cat) => ({
      ...cat,
      percentage: grandTotalMinutes > 0 ? (cat.totalMinutes / grandTotalMinutes) * 100 : 0
    }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes)

  return stats
}

/**
 * Group tasks by day of the week
 */
export function groupTasksByDay(tasks: TaskWithTags[], startOfWeek: Date): DayTasks[] {
  const days: DayTasks[] = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(date.getDate() + i)
    const dayStart = startOfDay(date)

    const dayTasks = tasks.filter((task) => {
      if (!task.startTime) return false
      const taskDate = startOfDay(new Date(task.startTime))
      return isSameDay(taskDate, dayStart)
    })

    const totalMinutes = dayTasks.reduce((sum, task) => sum + getTaskDurationMinutes(task), 0)

    days.push({
      date: dayStart,
      dayLabel: format(dayStart, 'EEEE, MMM d'), // "Monday, Dec 11"
      tasks: dayTasks,
      totalMinutes
    })
  }

  return days
}
