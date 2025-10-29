import { TimePickerSeparatorProps } from './types'

export const TimePickerSeparator = ({
  children = '–',
  className,
  style
}: TimePickerSeparatorProps) => {
  const defaultStyle: React.CSSProperties = {
    color: '#9b9a97',
    fontSize: '14px',
    ...style
  }

  return (
    <span className={className} style={defaultStyle}>
      {children}
    </span>
  )
}
