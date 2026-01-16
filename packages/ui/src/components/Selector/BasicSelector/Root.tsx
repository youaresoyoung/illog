import { ReactNode, useCallback, useRef, useState } from 'react'
import { BasicSelectorContext } from './context'
import { BasicSelectorRootProps } from './types'

export const Root = ({
  value: controlledValue,
  defaultValue = '',
  isOpened: controlledIsOpen,
  isDefaultOpen = false,
  disabled = false,
  onValueChange,
  onOpenChange,
  children
}: BasicSelectorRootProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(isDefaultOpen)
  const [valueNode, setValueNode] = useState<ReactNode>(null)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const isValueControlled = controlledValue !== undefined
  const isOpenControlled = controlledIsOpen !== undefined

  const value = isValueControlled ? controlledValue : uncontrolledValue
  const isOpen = isOpenControlled ? controlledIsOpen : uncontrolledOpen

  const handleValueChange = useCallback(
    (newValue: string) => {
      console.log(newValue)
      if (!isValueControlled) {
        setUncontrolledValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [isValueControlled, onValueChange]
  )

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!isOpenControlled) {
        setUncontrolledOpen(open)
      }
      onOpenChange?.(open)
    },
    [isOpenControlled, onOpenChange]
  )

  const handleValueNodeChange = useCallback((node: ReactNode) => {
    setValueNode(node)
  }, [])

  return (
    <BasicSelectorContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        isOpened: isOpen,
        onOpenChange: handleOpenChange,
        disabled,
        triggerRef,
        contentRef,
        valueNode,
        onValueNodeChange: handleValueNodeChange
      }}
    >
      {children}
    </BasicSelectorContext.Provider>
  )
}
