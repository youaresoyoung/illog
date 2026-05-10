import {
  KeyboardEvent,
  PointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from 'react'
import { ContextMenuContentProps } from './types'
import { useContextMenuContext } from './context/context'
import { useRovingFocus } from './hooks/useRovingFocus'
import { useClickOutside } from '../../hooks'
import { content as contentStyle } from './contextMenu.css'
import clsx from 'clsx'
import { Portal } from '../Portal'

export const Content = ({
  alignOffset = 0,
  isLoop = true,
  style,
  className,
  children,
  onEscapeKeyDown
}: ContextMenuContentProps) => {
  const { isOpen, pointerPosition, contentRef, onClose } = useContextMenuContext()
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)

  const {
    highlightNext,
    highlightPrev,
    highlightFirst,
    highlightLast,
    highlightByElement,
    clearHighlight,
    highlightedRef
  } = useRovingFocus({
    containerRef: contentRef,
    isLoop
  })

  useLayoutEffect(() => {
    if (!isOpen || !contentRef.current) return

    const content = contentRef.current

    const rafId = requestAnimationFrame(() => {
      const rect = content.getBoundingClientRect()

      let top = pointerPosition.y
      let left = pointerPosition.x

      if (left + rect.width > window.innerWidth) {
        left = pointerPosition.x - rect.width
      }
      if (top + rect.height > window.innerHeight) {
        top = pointerPosition.y - rect.height
      }

      top = Math.max(0, Math.min(top, window.innerHeight - rect.height))
      left = Math.max(0, Math.min(left, window.innerWidth - rect.width))

      setPosition({ top, left })
    })

    return () => cancelAnimationFrame(rafId)
  }, [isOpen, pointerPosition, alignOffset, contentRef])

  useEffect(() => {
    if (isOpen && contentRef.current) {
      contentRef.current.focus()
    }
  }, [isOpen, contentRef])

  useClickOutside({
    refs: [contentRef],
    onClickOutside: onClose,
    enabled: isOpen
  })

  useEffect(() => {
    if (!isOpen) return

    const handleScroll = (e: Event) => {
      if (contentRef.current?.contains(e.target as Node)) return
      onClose()
    }

    window.addEventListener('scroll', handleScroll, true)
    return () => window.removeEventListener('scroll', handleScroll, true)
  }, [isOpen, onClose, contentRef])

  const activateHighlighted = useCallback(() => {
    if (highlightedRef.current) {
      highlightedRef.current.click()
    }
  }, [highlightedRef])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
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
        case 'Escape':
          e.preventDefault()
          onEscapeKeyDown?.(e.nativeEvent)
          onClose()
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
      onClose,
      onEscapeKeyDown
    ]
  )

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const target = (e.target as HTMLElement).closest(
        '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'
      ) as HTMLElement | null

      if (target && !target.hasAttribute('data-disabled')) {
        highlightByElement(target)
      }
    },
    [highlightByElement]
  )

  const handlePointerLeave = useCallback(() => {
    clearHighlight()
  }, [clearHighlight])

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
