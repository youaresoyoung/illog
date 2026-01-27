import { KeyboardEvent, PointerEvent, RefObject, useCallback, useRef } from 'react'
import { useContextMenuSubContext } from '../context/subContext'
import { ContextMenuSubTriggerProps } from '../types'
import { Icon } from '../../Icon'
import { subTrigger as subTriggerStyle } from '../contextMenu.css'
import clsx from 'clsx'

const OPEN_DELAY = 100
const CLOSE_DELAY = 150

export const SubTrigger = ({
  isDisabled,
  textValue,
  className,
  style,
  children
}: ContextMenuSubTriggerProps) => {
  const { onOpenChange, isOpen, triggerRef, contentRef } = useContextMenuSubContext()
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearOpenTimer = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
  }, [])

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const handlePointerEnter = useCallback(() => {
    if (isDisabled) return
    clearOpenTimer()
    clearCloseTimer()
    openTimerRef.current = setTimeout(() => {
      onOpenChange(true)
    }, OPEN_DELAY)
  }, [isDisabled, onOpenChange, clearOpenTimer, clearCloseTimer])

  const handlePointerLeave = useCallback(
    (e: PointerEvent) => {
      clearOpenTimer()
      const relatedTarget = e.relatedTarget as HTMLElement | null

      if (relatedTarget && contentRef.current?.contains(relatedTarget)) return
      closeTimerRef.current = setTimeout(() => {
        onOpenChange(false)
      }, CLOSE_DELAY)
    },
    [clearOpenTimer, onOpenChange, contentRef]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isDisabled) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        e.stopPropagation()
        onOpenChange(true)
      }
    },
    [isDisabled, onOpenChange]
  )

  return (
    <div
      ref={triggerRef as RefObject<HTMLDivElement>}
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? undefined : -1}
      data-state={isOpen ? 'open' : 'closed'}
      data-disabled={isDisabled ? '' : undefined}
      data-value={textValue}
      className={clsx(subTriggerStyle, className)}
      style={style}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
    >
      {children}
      <Icon name="chevron_down" size="small" rotate={-90} />
    </div>
  )
}
