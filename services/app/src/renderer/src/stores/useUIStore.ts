import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

interface UIState {
  currentTaskId: string | undefined
  isTaskNoteOpen: boolean
  openTaskNote: (id: string) => void
  closeTaskNote: () => void
}

const useUIStore = create<UIState>((set) => ({
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

export const useUIStoreState = () =>
  useUIStore(
    useShallow((s) => ({
      currentTaskId: s.currentTaskId,
      isTaskNoteOpen: s.isTaskNoteOpen
    }))
  )

export const useUIStoreActions = () =>
  useUIStore(
    useShallow((s) => ({
      openTaskNote: s.openTaskNote,
      closeTaskNote: s.closeTaskNote
    }))
  )
