import { ChangeEvent, useState } from 'react'
import { Task } from 'services/app/src/types'
import { useTaskStore } from '../../stores/taskStore'

type Props = {
  task: Task
  handleDeleteTask: (id: string) => void
}

export const TaskCard = ({ task, handleDeleteTask }: Props) => {
  const openTaskNote = useTaskStore((state) => state.openTaskNote)
  const [form, setForm] = useState({ ...task })

  const handleClickCard = () => {
    openTaskNote(task.id)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // after test, it will be changed to save automatically when input loses focus
  const handleSave = async () => {
    const updatedTask = await window.api.task.update(form.id, form)
    setForm(updatedTask)
  }

  return (
    <li key={task.id} onClick={handleClickCard} role="button" tabIndex={0}>
      <input type="text" name="title" value={form.title} onChange={handleChange} />
      <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
      <button onClick={handleSave}>Save</button>
    </li>
  )
}
