import { ReactNode, MouseEvent } from 'react'
import { useTagSelectorContext } from './context'

type TriggerProps = {
  children: ReactNode
  asChild?: boolean
}

export const Trigger = ({ children, asChild }: TriggerProps) => {
  const { isOpen, setIsOpen, triggerRef } = useTagSelectorContext()

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

  if (asChild) {
    return (
      <div
        ref={triggerRef as React.RefObject<HTMLDivElement>}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        style={{ cursor: 'pointer' }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      onClick={handleClick}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
      {children}
    </button>
  )
}
