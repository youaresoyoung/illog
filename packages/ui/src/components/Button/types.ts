import { ButtonHTMLAttributes, ReactNode, Ref } from 'react'

export type ButtonProps = {
  variant: 'primary' // TODO: Extend this as needed for more variants
  size?: 'sm' | 'md' | 'lg'
  isDisabled?: boolean
  onClick?: () => void
  children: ReactNode
  className?: string
  isFullWidth?: boolean
  ariaLabel?: string
  ref?: Ref<HTMLButtonElement>
} & ButtonHTMLAttributes<HTMLButtonElement>
