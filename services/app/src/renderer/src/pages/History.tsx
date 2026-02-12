import { Stack, Text } from '@illog/ui'
import { useAllTasks } from '../hooks/queries'
import { useUIStore } from '../stores/useUIStore'
import { TaskCard } from '../components/task/TaskCard'
import { QueryErrorState } from '../components/QueryState'
import { ContentHeader } from '../components/layout/ContentHeader'

export const History = () => {
  const { data: tasks, isLoading, error, refetch } = useAllTasks()
  const openTaskNote = useUIStore((s) => s.openTaskNote)

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
      <ContentHeader title="History" />
      {tasks && tasks.length > 0 ? (
        <Stack gap="400" mt="400">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} handleOpenNote={openTaskNote} />
          ))}
        </Stack>
      ) : (
        <Stack gap="400" mt="2400" align="center">
          <Text textStyle="bodyBase" color="textDefaultTertiary" mt="400">
            No tasks found in history
          </Text>
        </Stack>
      )}
    </>
  )
}
