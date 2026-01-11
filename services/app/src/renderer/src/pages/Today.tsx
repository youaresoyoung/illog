import { TaskCard } from '../components/task/TaskCard'
import { Button, Icon, Text } from '@illog/ui'
import { useTodayTasks, useCreateTask, useDeleteTask } from '../hooks/queries/useTaskQueries'
import { useUIStoreActions } from '../stores/useUIStore'
import { ContentHeader } from '../components/layout/ContentHeader'

export const Today = () => {
  const { data: tasks, isLoading, error } = useTodayTasks()
  const { mutate: createTask } = useCreateTask()
  const { mutate: deleteTask } = useDeleteTask()
  const { openTaskNote } = useUIStoreActions()

  const handleAddLogClick = () => {
    createTask()
  }

  // TODO: handle loading and error states
  if (isLoading) {
    return <Text>Loading tasks...</Text>
  }

  if (error) {
    return <Text>Error loading tasks: {error.message}</Text>
  }

  return (
    <>
      <ContentHeader
        title="Today's Log"
        button={
          <Button variant="primary" onClick={handleAddLogClick}>
            <Icon name="plus" size="small" color="iconBrandOnBrand" />
            Add log
          </Button>
        }
      />

      {tasks && tasks.length > 0 ? (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              handleDeleteTask={deleteTask}
              handleOpenNote={openTaskNote}
            />
          ))}
        </ul>
      ) : (
        <p>No tasks for today</p>
      )}
    </>
  )
}
