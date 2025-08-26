import { create } from 'zustand'
import { combine } from 'zustand/middleware'

interface TaskState {
  currentTaskId: string | undefined
  isTaskNoteOpen: boolean
  openTaskNote: (taskId: string) => void
  closeTaskNote: () => void
}

export const useTaskStore = create<TaskState>()(
  combine(
    {
      currentTaskId: undefined as string | undefined,
      isTaskNoteOpen: false
    },
    (set) => ({
      openTaskNote: (taskId: string) =>
        set({
          currentTaskId: taskId,
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
