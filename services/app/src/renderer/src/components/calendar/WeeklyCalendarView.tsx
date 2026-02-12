import { useMemo } from 'react'
import { addDays, startOfDay, isSameDay, format } from 'date-fns'
import type { TaskWithTags } from '../../../../shared/types'
import { getCalendarTasksForDate, getLayoutColumns, getTaskColor } from '../../utils/calendar'
import { Calendar, DEFAULT_HOUR_HEIGHT, DEFAULT_GUTTER_WIDTH, formatTimeLabel } from '@illog/ui'
import type { DayColumnHeader } from '@illog/ui'
import { CalendarTask } from '../../types/calendar'

const DAY_COUNT = 7
const HOUR_HEIGHT = DEFAULT_HOUR_HEIGHT
const GUTTER_WIDTH = DEFAULT_GUTTER_WIDTH

type Props = {
  tasks: TaskWithTags[]
  weekStart: string // ISO string of Monday
  onTaskClick: (taskId: string) => void
}

function buildDayTasks(tasks: TaskWithTags[], weekStartDate: Date): Map<number, CalendarTask[]> {
  const map = new Map<number, CalendarTask[]>()
  for (let i = 0; i < DAY_COUNT; i++) {
    const day = addDays(weekStartDate, i)
    map.set(i, getCalendarTasksForDate(tasks, day))
  }
  return map
}

export const WeeklyCalendarView = ({ tasks, weekStart, onTaskClick }: Props) => {
  const weekStartDate = useMemo(() => startOfDay(new Date(weekStart)), [weekStart])

  const dayTasks = useMemo(() => buildDayTasks(tasks, weekStartDate), [tasks, weekStartDate])
  const dayLayouts = useMemo(() => {
    const m = new Map<number, ReturnType<typeof getLayoutColumns>>()
    for (let i = 0; i < DAY_COUNT; i++) {
      m.set(i, getLayoutColumns(dayTasks.get(i)!))
    }
    return m
  }, [dayTasks])

  const todayColIndex = useMemo(() => {
    const today = startOfDay(new Date())
    for (let i = 0; i < DAY_COUNT; i++) {
      if (isSameDay(today, addDays(weekStartDate, i))) return i
    }
    return -1
  }, [weekStartDate])

  const dayHeaders: DayColumnHeader[] = useMemo(() => {
    return Array.from({ length: DAY_COUNT }, (_, i) => {
      const date = addDays(weekStartDate, i)
      return {
        label: format(date, 'EEE'),
        dateNum: format(date, 'd'),
        isToday: todayColIndex === i
      }
    })
  }, [weekStartDate, todayColIndex])

  return (
    <Calendar.TimeGrid
      columns={DAY_COUNT}
      hourHeight={HOUR_HEIGHT}
      gutterWidth={GUTTER_WIDTH}
      scrollHeight="calc(100vh - 200px)"
      showCurrentTime={false}
      currentTimeColumn={todayColIndex}
      header={<Calendar.DayColumnHeaders days={dayHeaders} gutterWidth={GUTTER_WIDTH} />}
      style={{ marginTop: 16 }}
    >
      {Array.from({ length: DAY_COUNT }, (_, dayIdx) => {
        const items = dayLayouts.get(dayIdx) ?? []
        return items.map(({ calendarTask, columnIndex, totalColumns }) => {
          const { task, startMinutes, durationMinutes } = calendarTask
          const top = (startMinutes / 60) * HOUR_HEIGHT
          const height = Math.max((durationMinutes / 60) * HOUR_HEIGHT, 22)
          const colors = getTaskColor(task)

          const dayColLeftCalc = `(100% - ${GUTTER_WIDTH}px) / ${DAY_COUNT}`
          const dayColStartCalc = `${GUTTER_WIDTH}px + ${dayIdx} * ${dayColLeftCalc}`
          const subColWidth = `${dayColLeftCalc} / ${totalColumns}`
          const left = `calc(${dayColStartCalc} + ${columnIndex} * ${subColWidth} + 2px)`
          const width = `calc(${subColWidth} - 4px)`

          const subtitle =
            task.startTime && task.endTime
              ? `${formatTimeLabel(new Date(task.startTime))} – ${formatTimeLabel(new Date(task.endTime))}`
              : undefined

          return (
            <Calendar.TimeCell
              key={`${task.id}-day${dayIdx}`}
              id={task.id}
              title={task.title}
              subtitle={subtitle}
              color={colors}
              top={top}
              height={height}
              left={left}
              width={width}
              titleFontSize={11}
              subtitleFontSize={10}
              onClick={() => onTaskClick(task.id)}
              style={{ padding: '2px 4px' }}
            />
          )
        })
      })}
    </Calendar.TimeGrid>
  )
}
