import { create } from 'zustand'

interface UIState {
  currentTaskId: string | undefined
  isTaskNoteOpen: boolean

  openTaskNote: (id: string) => void
  closeTaskNote: () => void
}

export const useUIStore = create<UIState>((set) => ({
  currentTaskId: undefined,
  isTaskNoteOpen: false,

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
}))
