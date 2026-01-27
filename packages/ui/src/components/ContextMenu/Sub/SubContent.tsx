import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useContextMenuContext } from '../context/context'
import { useContextMenuSubContext } from '../context/subContext'
import { useRovingFocus } from '../hooks/useRovingFocus'
import { ContextMenuSubContentProps } from '../types'
import { Portal } from '../../Portal'
import { content as contentStyle } from '../contextMenu.css'
import clsx from 'clsx'

export const SubContent = ({
  isLoop = true,
  sideOffset = 0,
  alignOffset = 0,
  style,
  className,
  children,
  onEscapeKeyDown
}: ContextMenuSubContentProps) => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const { isOpen, contentRef, triggerRef, onOpenChange } = useContextMenuSubContext()
  const { onClose: onCloseRoot } = useContextMenuContext()

  const {
    highlightNext,
    highlightPrev,
    highlightFirst,
    highlightLast,
    highlightByElement,
    clearHighlight,
    highlightedRef
  } = useRovingFocus({ containerRef: contentRef, isLoop })

  useLayoutEffect(() => {
    if (!isOpen || !contentRef.current || !triggerRef.current) return

    const content = contentRef.current
    const trigger = triggerRef.current

    const rafId = requestAnimationFrame(() => {
      const triggerRect = trigger.getBoundingClientRect()
      const contentRect = content.getBoundingClientRect()

      let left = triggerRect.right + sideOffset
      if (left + contentRect.width > window.innerWidth) {
        left = triggerRect.left - contentRect.width - sideOffset
      }
      if (left < 0) {
        left = triggerRect.right + sideOffset
      }

      let top = triggerRect.top + alignOffset
      if (top + contentRect.height > window.innerHeight) {
        top = Math.max(0, window.innerHeight - contentRect.height)
      }

      setPosition({ top, left })
    })

    return () => cancelAnimationFrame(rafId)
  }, [isOpen, sideOffset, alignOffset, contentRef, triggerRef])

  const activateHighlighted = useCallback(() => {
    if (highlightedRef.current) {
      highlightedRef.current.click()
    }
  }, [highlightedRef])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          highlightNext()
          break
        case 'ArrowUp':
          e.preventDefault()
          highlightPrev()
          break
        case 'Home':
          e.preventDefault()
          highlightFirst()
          break
        case 'End':
          e.preventDefault()
          highlightLast()
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          activateHighlighted()
          break
        case 'ArrowLeft':
          e.preventDefault()
          e.stopPropagation()
          onOpenChange(false)
          triggerRef.current?.focus()
          break
        case 'Escape':
          e.preventDefault()
          onEscapeKeyDown?.(e.nativeEvent)
          onCloseRoot()
          break
        default:
          break
      }
    },
    [
      highlightNext,
      highlightPrev,
      highlightFirst,
      highlightLast,
      activateHighlighted,
      onOpenChange,
      onCloseRoot,
      onEscapeKeyDown,
      triggerRef
    ]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const target = (e.target as HTMLElement).closest(
        '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'
      ) as HTMLElement | null

      if (target && !target.hasAttribute('data-disabled')) {
        highlightByElement(target)
      }
    },
    [highlightByElement]
  )

  const handlePointerLeave = useCallback(
    (e: React.PointerEvent) => {
      clearHighlight()

      const relatedTarget = e.relatedTarget as HTMLElement | null

      if (relatedTarget && triggerRef.current?.contains(relatedTarget)) return
      onOpenChange(false)
    },
    [clearHighlight, onOpenChange, triggerRef]
  )

  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.focus()
    }
  }, [isOpen, contentRef])

  if (!isOpen) return null

  return (
    <Portal>
      <div
        ref={contentRef}
        role="menu"
        aria-orientation="vertical"
        data-state="open"
        tabIndex={-1}
        className={clsx(contentStyle, className)}
        style={{
          ...style,
          top: position?.top ?? 0,
          left: position?.left ?? 0,
          visibility: position ? 'visible' : 'hidden'
        }}
        onKeyDown={handleKeyDown}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {children}
      </div>
    </Portal>
  )
}
