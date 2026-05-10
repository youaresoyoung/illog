import { ReactNode, RefObject } from 'react'

export type BasicSelectorContextValue = {
  value: string
  isOpened: boolean
  disabled?: boolean
  triggerRef: RefObject<HTMLButtonElement | null>
  contentRef: RefObject<HTMLDivElement | null>
  valueNode: ReactNode
  onValueChange: (value: string) => void
  onOpenChange: (open: boolean) => void
  onValueNodeChange: (node: ReactNode) => void
}

export type BasicSelectorRootProps = {
  value?: string
  defaultValue?: string
  isOpened?: boolean
  isDefaultOpen?: boolean
  disabled?: boolean
  onValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export type BasicSelectorContentProps = {
  position?: 'item-aligned' | 'popover'
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  className?: string
  style?: React.CSSProperties
  children: ReactNode
}

export type BasicSelectorViewportProps = {
  children: ReactNode
  className?: string
}

export type BasicSelectorTriggerProps = {
  children: ReactNode
  className?: string
  ariaLabel?: string
}

export type BasicSelectorItemProps = {
  value: string
  disabled?: boolean
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}

export type BasicSelectorValueProps = {
  placeholder?: string
  children?: (value: string) => ReactNode
}
