import { TaskCard } from '../components/task/TaskCard'
import { useTaskStore } from '../stores/useTaskStore'

export const Today = () => {
  const tasks = useTaskStore((s) => s.tasks)
  const createTask = useTaskStore((s) => s.createTask)
  const deleteTask = useTaskStore((s) => s.deleteTask)

  return (
    <div>
      [Today]
      <button
        onClick={() =>
          createTask({
            title: 'Test Task',
            status: 'todo'
          })
        }
      >
        Create Task
      </button>
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} handleDeleteTask={deleteTask} />
          ))}
        </ul>
      ) : (
        <p>No tasks for today</p>
      )}
    </div>
  )
}
