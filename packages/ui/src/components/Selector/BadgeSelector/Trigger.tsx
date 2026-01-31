import { ReactNode, MouseEvent, CSSProperties } from 'react'
import { useBadgeSelectorContext } from './context'

type TriggerProps = {
  children: ReactNode
  asChild?: boolean
  style?: CSSProperties
}

export const Trigger = ({ children, asChild, style }: TriggerProps) => {
  const { isOpen, setIsOpen, triggerRef } = useBadgeSelectorContext()

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
        // TODO: Extract to css and handle focus state
        style={{
          cursor: 'pointer',
          overflow: 'hidden',
          flex: '0 1 auto',
          whiteSpace: 'nowrap',
          ...style
        }}
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
