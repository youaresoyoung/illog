import { ReactNode, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useProjectSelectorContext } from './context'
import * as style from '../selector.css'
import clsx from 'clsx'

type ContentProps = {
  children?: ReactNode
  className?: string
}

export const Content = ({ children, className }: ContentProps) => {
  const { isOpen, contentRef, triggerRef } = useProjectSelectorContext()
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return

    const updatePosition = () => {
      if (!triggerRef.current) return
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({ top: rect.bottom + 8, left: rect.left })
    }

    updatePosition()

    window.addEventListener('scroll', updatePosition)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen, triggerRef])

  if (!isOpen) return null

  return createPortal(
    <div
      ref={contentRef}
      className={clsx(style.container, className)}
      style={{ top: position.top, left: position.left }}
      role="listbox"
    >
      {children}
    </div>,
    document.body
  )
}
