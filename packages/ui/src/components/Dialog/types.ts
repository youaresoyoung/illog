import { ReactNode } from 'react'

export type DialogProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  role?: 'dialog' | 'alertdialog'
  ariaLabel?: string
  ariaDescribedby?: string
}

export type DialogTitleProps = {
  children: ReactNode
  className?: string
}

export type DialogContentProps = {
  children: ReactNode
  className?: string
}

export type DialogDescriptionProps = {
  children: ReactNode
  className?: string
}

export type DialogFooterProps = {
  children: ReactNode
  className?: string
}

export interface DialogComponent extends DialogProps {
  Title: DialogTitleProps
  Content: DialogContentProps
  Footer: DialogFooterProps
}
