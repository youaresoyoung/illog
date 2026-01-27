import { Stack, Text } from '@illog/ui'
import { useAllTasks } from '../hooks/queries'
import { useUIStore } from '../stores/useUIStore'
import { TaskCard } from '../components/task/TaskCard'

export const History = () => {
  const { data: tasks, isLoading, error } = useAllTasks()
  const openTaskNote = useUIStore((s) => s.openTaskNote)

  // TODO: handle loading and error states
  if (isLoading) {
    return <Text>Loading tasks...</Text>
  }

  if (error) {
    return <Text>Error loading tasks: {error.message}</Text>
  }

  return (
    <>
      {tasks && tasks.length > 0 ? (
        <Stack gap="400" mt="400">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} handleOpenNote={openTaskNote} />
          ))}
        </Stack>
      ) : (
        <p>No tasks for today</p>
      )}
    </>
  )
}
