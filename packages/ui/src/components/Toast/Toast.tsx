import { useEffect, useCallback, useState, useRef } from 'react'
import { Portal } from '../Portal'
import { ToastItemProps, ToastContainerProps } from './types'
import * as styles from './Toast.css'
import clsx from 'clsx'

const TOAST_DURATION = 4000
const EXIT_ANIMATION_DURATION = 150

export function ToastItem({ id, type, message, onClose }: ToastItemProps) {
  const [isExiting, setIsExiting] = useState(false)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleClose = useCallback(() => {
    setIsExiting(true)
    exitTimerRef.current = setTimeout(() => onClose(id), EXIT_ANIMATION_DURATION)
  }, [id, onClose])

  useEffect(() => {
    const timer = setTimeout(handleClose, TOAST_DURATION)
    return () => {
      clearTimeout(timer)
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    }
  }, [handleClose])

  return (
    <div
      className={clsx(styles.item, styles.itemType[type], isExiting && styles.itemExiting)}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      <span className={styles.message}>{message}</span>
      <button className={styles.closeButton} onClick={handleClose} aria-label="Close notification">
        &times;
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onRemove, className }: ToastContainerProps) {
  if (!Array.isArray(toasts) || toasts.length === 0) return null

  return (
    <Portal>
      <div className={clsx(styles.container, className)}>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={onRemove}
          />
        ))}
      </div>
    </Portal>
  )
}
