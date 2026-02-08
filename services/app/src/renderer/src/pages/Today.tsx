import { TaskCard } from '../components/task/TaskCard'
import { Button, Icon, Stack, Text, ToggleMenu } from '@illog/ui'
import { useTodayTasks, useCreateTask } from '../hooks/queries/useTaskQueries'
import { useUIStore } from '../stores/useUIStore'
import { ContentHeader } from '../components/layout/ContentHeader'
import { memo, useState } from 'react'
import { CalendarView } from '../components/calendar/CalendarView'
import { TASK_VIEW_ITEMS } from '../constant/nav'
import { TaskViewMode } from '../types/nav'
import { QueryErrorState } from '../components/QueryState'

export const Today = memo(() => {
  const [viewMode, setViewMode] = useState<TaskViewMode>('card')

  const { data: tasks, isLoading, error, refetch } = useTodayTasks()
  const { mutate: createTask } = useCreateTask()
  const openTaskNote = useUIStore((s) => s.openTaskNote)

  const handleAddLogClick = () => {
    createTask()
  }

  if (isLoading) {
    return (
      <Text role="status" aria-busy="true">
        Loading tasks...
      </Text>
    )
  }

  if (error) {
    return <QueryErrorState error={error} onRetry={() => refetch()} />
  }

  return (
    <>
      <ContentHeader
        title="Today's Log"
        actions={
          <ToggleMenu.Group>
            {TASK_VIEW_ITEMS.map((item, index) => (
              <ToggleMenu.Item
                key={item.value}
                item={item}
                index={index}
                value={viewMode}
                onChange={(v) => setViewMode(v as TaskViewMode)}
              />
            ))}
          </ToggleMenu.Group>
        }
        button={
          <Button variant="primary" onClick={handleAddLogClick}>
            <Icon name="plus" size="small" color="iconBrandOnBrand" />
            Add log
          </Button>
        }
      />

      {viewMode === 'card' ? (
        tasks && tasks.length > 0 ? (
          <Stack gap="400" mt="400">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} handleOpenNote={openTaskNote} />
            ))}
          </Stack>
        ) : (
          <Stack gap="400" mt="2400" align="center">
            <Text textStyle="bodyBase" color="textDefaultTertiary" mt="400">
              No tasks for today.
            </Text>
            <Text textStyle="bodyBase" color="textDefaultTertiary">
              Let&apos;s add some logs to track your progress and reflect on your day!
            </Text>
          </Stack>
        )
      ) : (
        <CalendarView tasks={tasks ?? []} onTaskClick={openTaskNote} />
      )}
    </>
  )
})

Today.displayName = 'Today'
