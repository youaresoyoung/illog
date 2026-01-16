import { useCallback, useEffect, useRef } from 'react'
import { BasicSelectorContentProps } from './types'
import { Portal } from '../../Portal'
import clsx from 'clsx'
import { useBasicSelectorContext } from './context'
import { useClickOutside } from 'packages/ui/src/hooks'
import { content as contentStyle } from './basicSelector.css.js'

export const Content = ({
  position = 'item-aligned',
  side = 'bottom',
  sideOffset = 0,
  children,
  className
}: BasicSelectorContentProps) => {
  const { isOpened, onOpenChange, triggerRef } = useBasicSelectorContext()
  const localRef = useRef<HTMLDivElement | null>(null)

  const handleClickOutside = useCallback(() => {
    if (isOpened) {
      onOpenChange(false)
    }
  }, [isOpened, onOpenChange])

  useClickOutside({
    refs: [localRef, triggerRef],
    onClickOutside: handleClickOutside
  })

  useEffect(() => {
    if (!isOpened || !localRef.current || !triggerRef.current) return

    const trigger = triggerRef.current
    const content = localRef.current

    const updatePosition = () => {
      const triggerRect = trigger.getBoundingClientRect()

      if (position === 'popover') {
        let top = 0
        let left = triggerRect.left

        switch (side) {
          case 'top':
            top = triggerRect.top - content.offsetHeight - sideOffset
            break
          case 'bottom':
            top = triggerRect.bottom + sideOffset
            break
          case 'left':
            top = triggerRect.top
          case 'right':
            top = triggerRect.top
            left = triggerRect.right + sideOffset
            break
        }
        content.style.top = `${top}px`
        content.style.left = `${left}px`
      } else {
        content.style.top = `${triggerRect.bottom + sideOffset}px`
        content.style.left = `${triggerRect.left}px`
        content.style.minWidth = `${triggerRect.width}px`
      }
    }

    updatePosition()

    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpened, sideOffset, side, position, triggerRef])

  if (!isOpened) return null

  return (
    <Portal>
      <div
        ref={localRef}
        role="listbox"
        data-state={isOpened ? 'open' : 'closed'}
        className={clsx(contentStyle, className)}
      >
        {children}
      </div>
    </Portal>
  )
}
