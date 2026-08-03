import { ButtonHTMLAttributes, ReactNode, Ref } from 'react'
import { ButtonSize, ButtonVariant } from '../../__generated__/spec.types'

export type ButtonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  isFullWidth?: boolean

  isDisabled?: boolean
  onClick?: () => void
  children: ReactNode
  className?: string
  ariaLabel?: string
  ref?: Ref<HTMLButtonElement>
} & ButtonHTMLAttributes<HTMLButtonElement>
