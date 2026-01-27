import { MouseEvent, RefObject, useCallback } from 'react'
import { ContextMenuTriggerProps } from './types'
import { useContextMenuContext } from './context/context'

export const Trigger = ({
  children,
  isDisabled = false,
  className,
  style
}: ContextMenuTriggerProps) => {
  const { isOpen, triggerRef, onOpenChange, onPointerPositionChange } = useContextMenuContext()

  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      if (isDisabled) return

      const activeElement = document.activeElement
      if (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement
      ) {
        return
      }

      e.preventDefault()
      onPointerPositionChange({ x: e.clientX, y: e.clientY })
      onOpenChange(true)
    },
    [isDisabled, onOpenChange, onPointerPositionChange]
  )

  return (
    <div
      ref={triggerRef as RefObject<HTMLDivElement>}
      onContextMenu={handleContextMenu}
      data-state={isOpen ? 'open' : 'closed'}
      data-disabled={isDisabled ? 'true' : 'false'}
      className={className}
      style={{ ...style }}
    >
      {children}
    </div>
  )
}
