import { getWeek, getYear, format, startOfDay, isSameDay } from 'date-fns'
import type { TaskWithTags } from '../../../shared/types'

export interface WeeklyStats {
  completedCount: number
  totalMinutes: number
  uniqueProjectCount: number
  avgTasksPerDay: number
}

export interface DayTasks {
  date: Date
  dayLabel: string // "Monday, Dec 11"
  tasks: TaskWithTags[]
  totalMinutes: number
}

export function getWeekId(date: Date): string {
  const week = getWeek(date, { weekStartsOn: 1 })
  const year = getYear(date)
  return `${year}-W${week.toString().padStart(2, '0')}`
}

export function getTaskDurationMinutes(task: TaskWithTags): number {
  if (!task.startTime || !task.endTime) return 0

  const start = new Date(task.startTime)
  const end = new Date(task.endTime)
  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60)))
}

export function formatDuration(minutes: number): string {
  if (minutes === 0) return '0m'

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export function formatHoursDecimal(minutes: number): string {
  const hours = minutes / 60
  return `${hours.toFixed(1)}h`
}

export function calculateWeeklyStats(tasks: TaskWithTags[], weekStart?: Date): WeeklyStats {
  const completedCount = tasks.filter((t) => t.doneAt !== null).length

  const totalMinutes = tasks.reduce((sum, task) => sum + getTaskDurationMinutes(task), 0)

  const uniqueProjects = new Set(tasks.map((t) => t.project?.id).filter(Boolean))
  const uniqueProjectCount = uniqueProjects.size

  let daysInWeek = 7
  if (weekStart) {
    const now = new Date()
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    if (now < weekEnd) {
      // NOTE: Current or future week: count elapsed days (at least 1)
      const elapsed = Math.floor((now.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)) + 1
      daysInWeek = Math.min(Math.max(elapsed, 1), 7)
    }
  }

  const avgTasksPerDay = completedCount / daysInWeek

  return {
    completedCount,
    totalMinutes,
    uniqueProjectCount,
    avgTasksPerDay
  }
}

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
