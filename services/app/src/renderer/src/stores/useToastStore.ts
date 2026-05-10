import { create } from 'zustand'
import type { ToastType } from '@illog/ui'

export type { ToastType }

export interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastStore {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

const MAX_TOASTS = 3

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    set((state) => {
      // Deduplicate by message and type
      if (state.toasts.some((t) => t.message === toast.message && t.type === toast.type)) {
        return state
      }

      const id = crypto.randomUUID()
      const newToasts = [...state.toasts, { ...toast, id }]
      if (newToasts.length > MAX_TOASTS) {
        return { toasts: newToasts.slice(-MAX_TOASTS) }
      }
      return { toasts: newToasts }
    })
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
  }
}))
