import { addDays, isAfter, isBefore, startOfDay } from 'date-fns'
import { TaskWithTags } from '../types'
import { CalendarTask, LayoutColumn } from '../types/calendar'
import {
  BackgroundColorToken,
  formatTimeLabel,
  getMinutesFromMidnight,
  TextColorToken
} from '@illog/ui'
import type { TimeCellColor } from '@illog/ui'

const MINUTES_IN_DAY = 24 * 60

/**
 * Given a list of tasks and a specific date, returns CalendarTask entries
 * for that date. Multi-day tasks are split:
 *  - Start day:  startTime → midnight
 *  - Middle day: 00:00 → 23:59
 *  - End day:    00:00 → endTime
 *  - Same day:   startTime → endTime
 */
export function getCalendarTasksForDate(tasks: TaskWithTags[], targetDate: Date): CalendarTask[] {
  const dayStart = startOfDay(targetDate)
  const dayEnd = startOfDay(addDays(targetDate, 1))

  return tasks
    .filter((task) => task.startTime && task.endTime)
    .reduce<CalendarTask[]>((acc, task) => {
      const taskStart = new Date(task.startTime!)
      const taskEnd = new Date(task.endTime!)

      if (taskEnd <= dayStart || taskStart >= dayEnd) return acc

      const visibleStart = isBefore(taskStart, dayStart) ? dayStart : taskStart
      const visibleEnd = isAfter(taskEnd, dayEnd) ? dayEnd : taskEnd

      const startMinutes = getMinutesFromMidnight(visibleStart)
      const endMinutes =
        visibleEnd.getTime() === dayEnd.getTime()
          ? MINUTES_IN_DAY
          : getMinutesFromMidnight(visibleEnd)

      const durationMinutes = Math.max(endMinutes - startMinutes, 15)
      acc.push({ task, startMinutes, durationMinutes })
      return acc
    }, [])
    .sort((a, b) => a.startMinutes - b.startMinutes)
}

export function getLayoutColumns(calendarTasks: CalendarTask[]): LayoutColumn[] {
  if (calendarTasks.length === 0) return []

  // 1. Group tasks by overlap
  const groups: CalendarTask[][] = []
  let currentGroup: CalendarTask[] = []
  let currentGroupEnd = 0

  for (const ct of calendarTasks) {
    // 현재 task 의 시작 시간이 현재 그룹의 끝나는 시간보다 빠르면 -> 겹침
    if (currentGroup.length === 0 || ct.startMinutes < currentGroupEnd) {
      currentGroup.push(ct)
      currentGroupEnd = Math.max(currentGroupEnd, ct.startMinutes + ct.durationMinutes)
    } else {
      groups.push(currentGroup)
      currentGroup = [ct]
      currentGroupEnd = ct.startMinutes + ct.durationMinutes
    }
  }
  if (currentGroup.length > 0) groups.push(currentGroup)

  // 2. Greedy column packing
  const result: LayoutColumn[] = []
  for (const group of groups) {
    const columns: CalendarTask[][] = []

    for (const ct of group) {
      let placed = false
      for (let colIdx = 0; colIdx < columns.length; colIdx++) {
        const lastInColumn = columns[colIdx][columns[colIdx].length - 1]
        // 현재 컬럼의 마지막 task 의 끝나는 시간이 현재 task의 시작 시간보다 빠르면 -> 같은 컬럼에 배치 가능
        if (lastInColumn.startMinutes + lastInColumn.durationMinutes <= ct.startMinutes) {
          columns[colIdx].push(ct)
          placed = true
          break
        }
      }
      // 모든 기존 컬럼에 배치 불가능하면 새로운 컬럼 생성
      if (!placed) columns.push([ct])
    }

    // 3. Assign column index and total columns for each task
    const totalColumns = columns.length
    for (let colIdx = 0; colIdx < columns.length; colIdx++) {
      for (const ct of columns[colIdx]) {
        result.push({ calendarTask: ct, columnIndex: colIdx, totalColumns })
      }
    }
  }

  return result
}

export function getTimeCellText(task: TaskWithTags): { subtitle?: string; caption?: string } {
  const subtitle =
    task.startTime && task.endTime
      ? `${formatTimeLabel(new Date(task.startTime))} – ${formatTimeLabel(new Date(task.endTime))}`
      : undefined
  const caption = task.taskType
    ? `${task.taskType.name}${task.project ? ` · ${task.project.name}` : ''}`
    : undefined

  return { subtitle, caption }
}

const BG_TOKEN_MAP: Record<string, BackgroundColorToken> = {
  blue: 'backgroundTagBlue',
  green: 'backgroundTagGreen',
  yellow: 'backgroundTagYellow',
  purple: 'backgroundTagPurple',
  red: 'backgroundTagRed',
  gray: 'backgroundTagGray'
}

const BORDER_COLOR_MAP: Record<string, string> = {
  blue: 'var(--text-tag-blue)',
  green: 'var(--text-tag-green)',
  yellow: 'var(--text-tag-yellow)',
  purple: 'var(--text-tag-purple)',
  red: 'var(--text-tag-red)',
  gray: 'var(--text-tag-gray)'
}

const TEXT_TOKEN_MAP: Record<string, TextColorToken> = {
  blue: 'textTagBlue',
  green: 'textTagGreen',
  yellow: 'textTagYellow',
  purple: 'textTagPurple',
  red: 'textTagRed',
  gray: 'textTagGray'
}

export function getTaskColor(task: TaskWithTags): TimeCellColor {
  const colorKey = task.taskType?.color
  if (colorKey) {
    const bg = BG_TOKEN_MAP[colorKey]
    const border = BORDER_COLOR_MAP[colorKey]
    const text = TEXT_TOKEN_MAP[colorKey]
    if (bg && border && text) {
      return { bg, border, text }
    }
  }
  return {
    bg: 'backgroundBrandTertiary' as BackgroundColorToken,
    border: 'var(--border-brand-default)',
    text: 'textDefaultDefault' as TextColorToken
  }
}

export function getTimeCellStyle({
  startMinutes,
  durationMinutes,
  task,
  columnIndex,
  totalColumns,
  hourHeight,
  gutterWidth
}: {
  startMinutes: number
  durationMinutes: number
  task: TaskWithTags
  columnIndex: number
  totalColumns: number
  hourHeight: number
  gutterWidth: number
}) {
  const top = (startMinutes / 60) * hourHeight
  const height = Math.max((durationMinutes / 60) * hourHeight, 22)
  const colors = getTaskColor(task)

  const gutterLeft = gutterWidth + 8
  const rightPad = 8
  const colWidthPercent = 100 / totalColumns
  const leftPercent = columnIndex * colWidthPercent
  const gap = totalColumns > 1 ? 2 : 0

  const left = `calc(${gutterLeft}px + (100% - ${gutterLeft + rightPad}px) * ${leftPercent / 100})`
  const width = `calc((100% - ${gutterLeft + rightPad}px) * ${colWidthPercent / 100} - ${gap}px)`

  return { top, height, colors, left, width }
}
