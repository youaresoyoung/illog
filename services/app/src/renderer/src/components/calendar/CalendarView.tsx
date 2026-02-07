import {
  Calendar,
  DEFAULT_GUTTER_WIDTH,
  DEFAULT_HOUR_HEIGHT,
  getMinutesFromMidnight,
  Stack,
  Text
} from '@illog/ui'
import { TaskWithTags } from '../../types'
import { useMemo } from 'react'
import {
  getCalendarTasksForDate,
  getLayoutColumns,
  getTimeCellStyle,
  getTimeCellText
} from '../../utils/calendar'

const HOUR_HEIGHT = DEFAULT_HOUR_HEIGHT
const GUTTER_WIDTH = DEFAULT_GUTTER_WIDTH
const SCROLL_HEIGHT = 'calc(100vh - 160px)'

type Props = {
  tasks: TaskWithTags[]
  onTaskClick: (taskId: string) => void
}

export const CalendarView = ({ tasks, onTaskClick }: Props) => {
  const today = useMemo(() => new Date(), [])
  const calendarTasks = useMemo(() => getCalendarTasksForDate(tasks, today), [tasks, today])
  const layoutItems = useMemo(() => getLayoutColumns(calendarTasks), [calendarTasks])

  const nowMinutes = getMinutesFromMidnight(new Date())
  const nowTop = (nowMinutes / 60) * HOUR_HEIGHT
  const hasCalendarTasks = calendarTasks.length > 0

  return (
    <Calendar.TimeGrid
      columns={1}
      hourHeight={HOUR_HEIGHT}
      gutterWidth={GUTTER_WIDTH}
      scrollHeight={SCROLL_HEIGHT}
      showCurrentTime
      style={{ marginTop: 16 }}
    >
      {layoutItems.map(({ calendarTask, columnIndex, totalColumns }) => {
        const { task, startMinutes, durationMinutes } = calendarTask
        const { subtitle, caption } = getTimeCellText(task)
        const { top, height, left, width, colors } = getTimeCellStyle({
          startMinutes,
          durationMinutes,
          task,
          columnIndex,
          totalColumns,
          hourHeight: HOUR_HEIGHT,
          gutterWidth: GUTTER_WIDTH
        })

        return (
          <Calendar.TimeCell
            key={task.id}
            id={task.id}
            title={task.title}
            subtitle={subtitle}
            caption={caption}
            color={colors}
            top={top}
            height={height}
            left={left}
            width={width}
            onClick={() => onTaskClick(task.id)}
          />
        )
      })}

      {!hasCalendarTasks && (
        <Stack position="absolute" top={nowTop + 20} left={GUTTER_WIDTH} right={0} zIndex={1}>
          <Text textStyle="bodyBase" color="textDefaultTertiary">
            No time-tracked tasks for today. Add start & end times to see them here.
          </Text>
        </Stack>
      )}
    </Calendar.TimeGrid>
  )
}
