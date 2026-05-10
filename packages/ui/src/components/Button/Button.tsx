import clsx from 'clsx'
import { ButtonProps } from './types'
import { buttonRecipe } from './button.css'

export const Button = (props: ButtonProps) => {
  const {
    variant = 'primary',
    size = 'md',
    isDisabled,
    onClick,
    children,
    className,
    isFullWidth,
    ariaLabel,
    ref,
    ...rest
  } = props

  return (
    <button
      {...rest}
      className={clsx([
        buttonRecipe({
          variant,
          size,
          isFullWidth
        }),
        className
      ])}
      aria-label={ariaLabel}
      ref={ref}
      onClick={onClick}
      disabled={isDisabled}
    >
      {children}
    </button>
  )
}
