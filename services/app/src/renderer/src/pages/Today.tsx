import { TaskCard } from '../components/task/TaskCard'
import { useTaskStore } from '../stores/useTaskStore'
import { Box, Button, Icon, Text } from '@illog/ui'

export const Today = () => {
  const tasks = useTaskStore((s) => s.tasks)
  const createTask = useTaskStore((s) => s.createTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)

  const handleAddLogClick = () => {
    createTask({
      title: '',
      status: 'todo'
    })
  }

  return (
    <>
      {/* Box -> Container */}
      <Box display="flex" justifyContent="space-between" alignItems="center" my="1200">
        <Text as="h2" textStyle="subheading">
          Today’s Log
        </Text>
        <Button variant="primary" onClick={handleAddLogClick}>
          <Icon name="plus" size="small" color="iconBrandOnBrand" />
          Add log
        </Button>
      </Box>
      {tasks && tasks.length > 0 ? (
        <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} handleDeleteTask={deleteTask} />
          ))}
        </ul>
      ) : (
        <p>No tasks for today</p>
      )}
    </>
  )
}
