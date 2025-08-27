import { OmittedTask, Task } from 'services/app/src/types'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'

interface TaskState {
  tasks: Task[]
  currentTaskId: string | undefined
  isTaskNoteOpen: boolean
  loadTasks: () => Promise<void>
  createTask: (task: Partial<OmittedTask>) => Promise<void>
  updateTask: (id: string, contents: Partial<OmittedTask>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  openTaskNote: (id: string) => void
  closeTaskNote: () => void
}

export const useTaskStore = create<TaskState>()(
  combine(
    {
      tasks: [] as Task[],
      currentTaskId: undefined as string | undefined,
      isTaskNoteOpen: false
    },
    (set, get) => ({
      loadTasks: async () => {
        const tasks = await window.api.task.getAll()
        set({ tasks })
      },
      createTask: async (task: Partial<OmittedTask>) => {
        const createdTask = await window.api.task.create(task)
        set({ tasks: [...get().tasks, createdTask] })
      },
      updateTask: async (id: string, contents: Partial<OmittedTask>) => {
        const updatedTask = await window.api.task.update(id, contents)
        set({ tasks: get().tasks.map((task) => (task.id === id ? updatedTask : task)) })
      },
      deleteTask: async (id: string) => {
        await window.api.task.softDelete(id)
      },
      openTaskNote: (id: string) =>
        set({
          currentTaskId: id,
          isTaskNoteOpen: true
        }),
      closeTaskNote: () =>
        set({
          currentTaskId: undefined,
          isTaskNoteOpen: false
        })
    })
  )
)
