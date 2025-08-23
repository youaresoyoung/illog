import { useEffect, useState } from 'react'
import { TaskCard } from '../components/task/TaskCard'
import { Task } from 'services/app/src/types'

export const Today = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  const handleCreateTask = async () => {
    const task = await window.api.task.create({
      title: 'Test Task',
      status: 'todo'
    })

    setTasks((prev) => [...prev, task])
  }

  const handleDeleteTask = async (id: string) => {
    await window.api.task.softDelete(id)
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  useEffect(() => {
    async function getTasks() {
      const tasks = await window.api.task.getAll()

      setTasks(tasks)
    }
    getTasks()
  }, [])

  return (
    <div>
      [Today]
      <button onClick={handleCreateTask}>Create Task</button>
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} handleDeleteTask={handleDeleteTask} />
          ))}
        </ul>
      ) : (
        <p>No tasks for today</p>
      )}
    </div>
  )
}
