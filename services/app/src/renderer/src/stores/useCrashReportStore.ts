import { create } from 'zustand'

interface CrashReportUIState {
  isCrashDialogOpen: boolean
  pendingCrashError: { message: string; stack?: string } | null

  showCrashDialog: (error: { message: string; stack?: string }) => void
  closeCrashDialog: () => void
}

export const useCrashReportStore = create<CrashReportUIState>((set) => ({
  isCrashDialogOpen: false,
  pendingCrashError: null,

  showCrashDialog: (error) => {
    set({ isCrashDialogOpen: true, pendingCrashError: error })
  },

  closeCrashDialog: () => {
    set({ isCrashDialogOpen: false, pendingCrashError: null })
  }
}))
