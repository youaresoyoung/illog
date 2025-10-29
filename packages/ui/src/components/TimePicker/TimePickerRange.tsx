import { TimePickerRangeProps } from './types'

export const TimePickerRange = ({ children, className, style }: TimePickerRangeProps) => {
  const defaultStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    ...style
  }

  return (
    <div className={className} style={defaultStyle}>
      {children}
    </div>
  )
}
