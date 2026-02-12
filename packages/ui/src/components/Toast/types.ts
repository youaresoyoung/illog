import { ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export type ToastItemProps = {
  id: string
  type: ToastType
  message: ReactNode
  onClose: (id: string) => void
}

export type ToastContainerProps = {
  toasts: Array<{ id: string; type: ToastType; message: ReactNode }>
  onRemove: (id: string) => void
  className?: string
}
