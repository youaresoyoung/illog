import { Task } from 'electron'
import { useEffect, useState } from 'react'

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
            <li key={task.id}>
              {task.title}
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tasks for today</p>
      )}
    </div>
  )
}
