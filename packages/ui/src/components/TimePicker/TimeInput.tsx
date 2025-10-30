import { ChangeEvent, CSSProperties, useRef } from 'react'
import { formatTime, toDateTimeLocalValue } from './formatTime'
import { TimePickerInputProps } from './types'
import { useTimePickerContext } from './TimePicker'

export const TimePickerInput = ({
  field,
  placeholder = 'Add time',
  className,
  style
}: TimePickerInputProps) => {
  const { value, onChange, startDate, endDate } = useTimePickerContext()
  const inputRef = useRef<HTMLInputElement>(null)

  const date = field === 'start' ? startDate : endDate
  const currentValue = field === 'start' ? value.start : value.end

  const handleClick = () => {
    inputRef.current?.showPicker()
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange({
      ...value,
      [field]: newValue ? new Date(newValue).toISOString() : null
    })
  }

  const defaultStyle: CSSProperties = {
    padding: '6px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#f7f7f7',
    fontSize: '14px',
    color: date ? '#37352f' : '#9b9a97',
    transition: 'background-color 0.15s ease',
    minWidth: '80px',
    ...style
  }

  return (
    <>
      <div
        className={className}
        style={defaultStyle}
        onClick={handleClick}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eeeeee')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f7f7f7')}
      >
        {date ? formatTime(date) : placeholder}
      </div>
      <input
        ref={inputRef}
        type="datetime-local"
        value={toDateTimeLocalValue(currentValue)}
        onChange={handleChange}
        style={{ display: 'none' }}
      />
    </>
  )
}
