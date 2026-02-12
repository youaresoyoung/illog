import { useBasicSelectorContext } from './context'
import { BasicSelectorValueProps } from './types'
import { value as valueStyle } from './basicSelector.css.js'

export const Value = ({ placeholder, children }: BasicSelectorValueProps) => {
  const { value, valueNode } = useBasicSelectorContext()

  const displayValue = value ? (children ? children(value) : valueNode) : placeholder

  return <span className={valueStyle}>{displayValue}</span>
}
