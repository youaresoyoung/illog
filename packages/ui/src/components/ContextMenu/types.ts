import { CSSProperties, ReactNode, RefObject } from 'react'

export type ContextMenuContextValue = {
  isOpen: boolean
  pointerPosition: { x: number; y: number }
  contentRef: RefObject<HTMLDivElement | null>
  triggerRef: RefObject<HTMLElement | null>
  modal: boolean
  onOpenChange: (isOpen: boolean) => void
  onPointerPositionChange: (pos: { x: number; y: number }) => void
  onClose: () => void
}

export type ContextMenuRootProps = {
  modal?: boolean
  children: ReactNode
  onOpenChange?: (isOpen: boolean) => void
}

export type ContextMenuTriggerProps = {
  isDisabled?: boolean
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export type ContextMenuContentProps = {
  alignOffset?: number
  isLoop?: boolean
  style?: CSSProperties
  className?: string
  children: ReactNode
  onEscapeKeyDown?: (event: KeyboardEvent) => void
}

export type ContextMenuItemProps = {
  isDisabled?: boolean
  textValue?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
  onSelect?: () => void
}

export type ContextMenuSubContextValue = {
  isOpen: boolean
  triggerRef: RefObject<HTMLElement | null>
  contentRef: RefObject<HTMLDivElement | null>
  onOpenChange: (isOpen: boolean) => void
}

export type ContextMenuSubRootProps = {
  isOpen?: boolean
  isDefaultOpen?: boolean
  children: ReactNode
  onOpenChange?: (isOpen: boolean) => void
}

export type ContextMenuSubTriggerProps = {
  isDisabled?: boolean
  textValue?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}

export type ContextMenuSubContentProps = {
  isLoop?: boolean
  sideOffset?: number
  alignOffset?: number
  style?: CSSProperties
  className?: string
  children: ReactNode
  onEscapeKeyDown?: (event: KeyboardEvent) => void
}
