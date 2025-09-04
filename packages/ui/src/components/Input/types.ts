import { ChangeEvent, InputHTMLAttributes, Ref } from 'react'

export type InputProps = {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'error' | 'success'
  isFullWidth?: boolean
  isDisabled?: boolean
  errorMessage?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  ref?: Ref<HTMLInputElement>
} & InputHTMLAttributes<HTMLInputElement>
