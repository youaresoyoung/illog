import { OmittedTask, TaskWithTags } from 'services/app/src/types'
import { create } from 'zustand'
import { combine } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

interface TaskState {
  tasks: TaskWithTags[]
  currentTaskId: string | undefined
  isTaskNoteOpen: boolean
  loadTasks: () => Promise<void>
  createTask: (task: Partial<OmittedTask>) => Promise<void>
  updateTask: (id: string, contents: Partial<OmittedTask>) => Promise<void>
  addTag: (taskId: string, tagId: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  removeTag: (taskId: string, tagId: string) => Promise<void>
  openTaskNote: (id: string) => void
  closeTaskNote: () => void
}

export const useTaskStore = create<TaskState>()(
  combine(
    {
      tasks: [] as TaskWithTags[],
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
      addTag: async (taskId: string, tagId: string) => {
        const updatedTask = await window.api.task.addTag(taskId, tagId)
        set({
          tasks: get().tasks.map((task) => (task?.id === taskId ? updatedTask : task))
        })
      },
      deleteTask: async (id: string) => {
        await window.api.task.softDelete(id)
      },
      removeTag: async (taskId: string, tagId: string) => {
        const updatedTask = await window.api.task.removeTag(taskId, tagId)
        set({
          tasks: get().tasks.map((task) => (task?.id === taskId ? updatedTask : task))
        })
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

// Selector helpers (grouped selects with shallow compare) for idiomatic usage in components
export const useTaskActions = () =>
  useTaskStore(
    useShallow((s) => ({
      loadTasks: s.loadTasks,
      createTask: s.createTask,
      updateTask: s.updateTask,
      deleteTask: s.deleteTask,
      addTag: s.addTag,
      removeTag: s.removeTag,
      openTaskNote: s.openTaskNote,
      closeTaskNote: s.closeTaskNote
    }))
  )

export const useTaskState = () =>
  useTaskStore(
    useShallow((s) => ({
      tasks: s.tasks,
      currentTaskId: s.currentTaskId,
      isTaskNoteOpen: s.isTaskNoteOpen
    }))
  )
