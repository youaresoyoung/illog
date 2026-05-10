import { create } from 'zustand'
import { UserPlan } from '../types'

interface UserState {
  timeZone: string
  /**
   * Client-side cached plan.
   * The source of truth is TanStack Query (useUserPlanInfo),
   * and this is used for places that require synchronous access (e.g. initial value for conditional rendering).
   */
  plan: UserPlan
  setPlan: (plan: UserPlan) => void
}

export const useUserStore = create<UserState>((set) => ({
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  plan: 'local',
  setPlan: (plan: UserPlan) => set({ plan })
}))
