import { useCallback, useMemo, useRef, useState } from 'react'
import { ContextMenuRootProps } from './types'
import { ContextMenuContext } from './context/context'

export const Root = ({ children, onOpenChange, modal = false }: ContextMenuRootProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setIsOpen(isOpen)
      if (onOpenChange) {
        onOpenChange(isOpen)
      }
    },
    [onOpenChange]
  )

  const handleClose = useCallback(() => {
    handleOpenChange(false)
  }, [handleOpenChange])

  const contextValue = useMemo(
    () => ({
      isOpen,
      onOpenChange: handleOpenChange,
      pointerPosition,
      onPointerPositionChange: setPointerPosition,
      contentRef,
      triggerRef,
      onClose: handleClose,
      modal
    }),
    [isOpen, handleOpenChange, pointerPosition, handleClose, modal]
  )

  return <ContextMenuContext.Provider value={contextValue}>{children}</ContextMenuContext.Provider>
}
