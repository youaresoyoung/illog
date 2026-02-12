import { ToastContainer as UIToastContainer } from '@illog/ui'
import { useToastStore } from '../../stores/useToastStore'

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  if (!Array.isArray(toasts) || toasts.length === 0) return null

  return <UIToastContainer toasts={toasts} onRemove={removeToast} />
}
