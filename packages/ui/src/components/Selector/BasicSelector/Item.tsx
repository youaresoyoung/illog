import { KeyboardEvent } from 'react'
import { BasicSelectorItemProps } from './types'
import { useBasicSelectorContext } from './context'
import { item as itemStyles } from './basicSelector.css'
import clsx from 'clsx'

export const Item = ({ value, disabled = false, children, className }: BasicSelectorItemProps) => {
  const { value: selectedValue, onValueChange, onOpenChange } = useBasicSelectorContext()
  const isSelected = selectedValue === value

  const handleClick = () => {
    if (disabled) return
    onValueChange(value)
    onOpenChange(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLLIElement>) => {
    if (disabled) return

    switch (e.code) {
      case 'Enter':
      case 'Space':
        e.preventDefault()
        onValueChange(value)
        onOpenChange(false)
        break
    }
  }

  return (
    <li
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      data-state={isSelected ? 'selected' : 'unselected'}
      data-disabled={disabled ? '' : undefined}
      tabIndex={disabled ? -1 : 0}
      className={clsx(itemStyles, className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </li>
  )
}
