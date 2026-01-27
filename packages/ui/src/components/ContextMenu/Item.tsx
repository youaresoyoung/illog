import { useCallback } from 'react'
import { ContextMenuItemProps } from './types'
import { useContextMenuContext } from './context/context'
import { item as itemStyle } from './contextMenu.css'
import clsx from 'clsx'

export const Item = ({
  isDisabled = false,
  textValue,
  className,
  style,
  children,
  onSelect
}: ContextMenuItemProps) => {
  const { onClose } = useContextMenuContext()

  const handleClick = useCallback(() => {
    if (isDisabled) return
    onSelect?.()
    onClose()
  }, [isDisabled, onSelect, onClose])

  return (
    <div
      role="menuitem"
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? undefined : -1}
      data-disabled={isDisabled ? '' : undefined}
      data-value={textValue}
      className={clsx(itemStyle, className)}
      style={style}
      onClick={handleClick}
    >
      {children}
    </div>
  )
}
