import { PageId } from './../constant/nav'
import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

interface UIState {
  currentTaskId: string | undefined
  isTaskNoteOpen: boolean
  activeTab: PageId

  openTaskNote: (id: string) => void
  closeTaskNote: () => void
  setActiveTab: (tab: PageId) => void
}

const useUIStore = create<UIState>((set) => ({
  currentTaskId: undefined,
  isTaskNoteOpen: false,
  activeTab: 'today',

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
  setActiveTab: (tab) => set({ activeTab: tab })
}))

export const useUIStoreState = () =>
  useUIStore(
    useShallow((s) => ({
      currentTaskId: s.currentTaskId,
      isTaskNoteOpen: s.isTaskNoteOpen,
      activeTab: s.activeTab
    }))
  )

export const useUIStoreActions = () =>
  useUIStore(
    useShallow((s) => ({
      openTaskNote: s.openTaskNote,
      closeTaskNote: s.closeTaskNote,
      setActiveTab: s.setActiveTab
    }))
  )
