import clsx from 'clsx'

import * as style from './input.css'
import { InputProps } from './tpyes'

export const Input = (props: InputProps) => {
  const {
    type = 'text',
    name = '',
    value = '',
    size = 'md',
    variant = 'default',
    isFullWidth,
    isDisabled,
    errorMessage,
    onChange,
    ref,
    className,
    ...rest
  } = props

  return (
    <div className={style.inputWrapper}>
      <input
        type={type}
        name={name}
        value={value}
        ref={ref}
        onChange={onChange}
        className={clsx([
          style.inputRecipe({
            variant,
            size,
            isFullWidth
          }),
          className
        ])}
        disabled={isDisabled}
        {...rest}
      />
      {errorMessage && <span className={style.errorText}>{errorMessage}</span>}
    </div>
  )
}
