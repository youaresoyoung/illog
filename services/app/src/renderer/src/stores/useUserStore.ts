import { create } from 'zustand'

interface UserState {
  timeZone: string
}

export const useUserStore = create<UserState>(() => ({
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
}))
