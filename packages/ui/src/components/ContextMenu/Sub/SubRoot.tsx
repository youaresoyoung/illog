import { useCallback, useMemo, useRef, useState } from 'react'
import { ContextMenuSubRootProps } from '../types'
import { ContextMenuSubContext } from '../context/subContext'

export const SubRoot = ({
  isOpen: controlledOpen,
  isDefaultOpen = false,
  onOpenChange,
  children
}: ContextMenuSubRootProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(isDefaultOpen)
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isControlled) setUncontrolledOpen(isOpen)
      onOpenChange?.(isOpen)
    },
    [isControlled, onOpenChange]
  )

  const contextValue = useMemo(
    () => ({
      isOpen,
      triggerRef,
      contentRef,
      onOpenChange: handleOpenChange
    }),
    [isOpen, handleOpenChange]
  )

  return (
    <ContextMenuSubContext.Provider value={contextValue}>{children}</ContextMenuSubContext.Provider>
  )
}
