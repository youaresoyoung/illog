import { KeyboardEvent } from 'react'
import { BasicSelectorTriggerProps } from './types'
import { useBasicSelectorContext } from './context'
import clsx from 'clsx'
import { trigger as triggerStyle } from './basicSelector.css'
import { Icon } from '../../Icon'

export const Trigger = ({ children, className, ariaLabel }: BasicSelectorTriggerProps) => {
  const { isOpened, onOpenChange, disabled, triggerRef } = useBasicSelectorContext()

  const handleClick = () => {
    onOpenChange(!isOpened)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return

    switch (e.code) {
      case 'Enter':
      case 'Space':
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault()
        onOpenChange(true)
        break
      case 'Escape':
        e.preventDefault()
        onOpenChange(false)
        break
    }
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      role="combobox"
      aria-expanded={isOpened}
      aria-haspopup="listbox"
      aria-label={ariaLabel}
      disabled={disabled}
      data-state={isOpened ? 'open' : 'closed'}
      className={clsx(triggerStyle, className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {children}
      <Icon name="chevron_down" rotate={isOpened ? 180 : 0} />
    </button>
  )
}
