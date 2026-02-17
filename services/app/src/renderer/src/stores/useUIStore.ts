import { create } from 'zustand'

interface UIState {
  currentTaskId: string | undefined
  isTaskNoteOpen: boolean
  currentSelectedProjectId: string | undefined

  openTaskNote: (id: string) => void
  closeTaskNote: () => void
  setCurrentSelectedProjectId: (id: string | undefined) => void
}

export const useUIStore = create<UIState>((set) => ({
  currentTaskId: undefined,
  isTaskNoteOpen: false,
  currentSelectedProjectId: undefined,

  openTaskNote: (id: string) =>
    set({
      currentTaskId: id,
      isTaskNoteOpen: true
    }),
  closeTaskNote: () =>
    set({
      currentTaskId: undefined,
      isTaskNoteOpen: false
    }),
  setCurrentSelectedProjectId: (id: string | undefined) =>
    set({
      currentSelectedProjectId: id
    })
}))
