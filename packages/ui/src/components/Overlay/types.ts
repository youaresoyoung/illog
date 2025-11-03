import { ReactNode } from 'react'

export type OverlayAnimation = 'fade' | 'slideLeft' | 'slideRight'

export type OverlayProps = {
  isOpen: boolean
  onClose?: () => void
  children: ReactNode
  backgroundOpacity?: number
  disableBackdropClick?: boolean
  disableEscapeKey?: boolean
  zIndex?: number
  backdropClassName?: string
  contentClassName?: string
  animationDuration?: number
  animation?: OverlayAnimation
  ariaLabel?: string
  container?: Element | DocumentFragment
}
