import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { TimePicker, useTimePickerContext } from './TimePicker'
import { TimePickerValue } from './types'

describe('TimePicker', () => {
  const mockValue: TimePickerValue = {
    start: '2024-01-15T09:00:00',
    end: '2024-01-15T17:00:00'
  }

  const mockDifferentDayValue: TimePickerValue = {
    start: '2024-01-15T09:00:00',
    end: '2024-01-16T17:00:00'
  }

  const emptyValue: TimePickerValue = {
    start: null,
    end: null
  }

  describe('TimePicker (Root)', () => {
    it('renders children', () => {
      const handleChange = vi.fn()
      const { getByText } = render(
        <TimePicker value={mockValue} onChange={handleChange}>
          <div>Time picker content</div>
        </TimePicker>
      )

      expect(getByText('Time picker content')).toBeInTheDocument()
    })

    it('provides context to children', () => {
      const handleChange = vi.fn()
      const TestConsumer = () => {
        const context = useTimePickerContext()
        return <div data-testid="context-test">{context.value.start}</div>
      }

      const { getByTestId } = render(
        <TimePicker value={mockValue} onChange={handleChange}>
          <TestConsumer />
        </TimePicker>
      )

      expect(getByTestId('context-test')).toHaveTextContent('2024-01-15T09:00:00')
    })

    it('calculates isSameDay correctly for same day', () => {
      const handleChange = vi.fn()
      const TestConsumer = () => {
        const context = useTimePickerContext()
        return <div data-testid="same-day">{context.isSameDay ? 'same' : 'different'}</div>
      }

      const { getByTestId } = render(
        <TimePicker value={mockValue} onChange={handleChange}>
          <TestConsumer />
        </TimePicker>
      )

      expect(getByTestId('same-day')).toHaveTextContent('same')
    })

    it('calculates isSameDay correctly for different days', () => {
      const handleChange = vi.fn()
      const TestConsumer = () => {
        const context = useTimePickerContext()
        return <div data-testid="same-day">{context.isSameDay ? 'same' : 'different'}</div>
      }

      const { getByTestId } = render(
        <TimePicker value={mockDifferentDayValue} onChange={handleChange}>
          <TestConsumer />
        </TimePicker>
      )

      expect(getByTestId('same-day')).toHaveTextContent('different')
    })

    it('handles null values', () => {
      const handleChange = vi.fn()
      const TestConsumer = () => {
        const context = useTimePickerContext()
        return (
          <div data-testid="null-test">
            {context.startDate === null ? 'null-start' : 'has-start'}
          </div>
        )
      }

      const { getByTestId } = render(
        <TimePicker value={emptyValue} onChange={handleChange}>
          <TestConsumer />
        </TimePicker>
      )

      expect(getByTestId('null-test')).toHaveTextContent('null-start')
    })
  })

  describe('useTimePickerContext', () => {
    it('throws error when used outside TimePicker', () => {
      const TestComponent = () => {
        useTimePickerContext()
        return null
      }

      expect(() => {
        render(<TestComponent />)
      }).toThrow('TimePicker compound components must be used within TimePicker')
    })
  })

  describe('TimePicker.Input', () => {
    it('renders hidden input element', () => {
      const handleChange = vi.fn()
      const { container } = render(
        <TimePicker value={mockValue} onChange={handleChange}>
          <TimePicker.Input field="start" />
        </TimePicker>
      )

      const input = container.querySelector('input[type="datetime-local"]')
      expect(input).toBeInTheDocument()
      expect(input).toHaveStyle({ display: 'none' })
    })

    it('displays formatted time for start field', () => {
      const handleChange = vi.fn()
      const { getByText } = render(
        <TimePicker value={mockValue} onChange={handleChange}>
          <TimePicker.Input field="start" />
        </TimePicker>
      )

      expect(getByText('9am')).toBeInTheDocument()
    })

    it('displays formatted time for end field', () => {
      const handleChange = vi.fn()
      const { getByText } = render(
        <TimePicker value={mockValue} onChange={handleChange}>
          <TimePicker.Input field="end" />
        </TimePicker>
      )

      expect(getByText('5pm')).toBeInTheDocument()
    })

    it('applies custom className to visible div', () => {
      const handleChange = vi.fn()
      const { container } = render(
        <TimePicker value={mockValue} onChange={handleChange}>
          <TimePicker.Input field="start" className="custom-input" />
        </TimePicker>
      )

      expect(container.querySelector('.custom-input')).toBeInTheDocument()
    })

    it('displays placeholder when value is null', () => {
      const handleChange = vi.fn()
      const { getByText } = render(
        <TimePicker value={emptyValue} onChange={handleChange}>
          <TimePicker.Input field="start" placeholder="Select time" />
        </TimePicker>
      )

      expect(getByText('Select time')).toBeInTheDocument()
    })

    it('displays default placeholder when not specified', () => {
      const handleChange = vi.fn()
      const { getByText } = render(
        <TimePicker value={emptyValue} onChange={handleChange}>
          <TimePicker.Input field="start" />
        </TimePicker>
      )

      expect(getByText('Add time')).toBeInTheDocument()
    })
  })

  describe('TimePicker.Separator', () => {
    it('renders separator with default content', () => {
      const handleChange = vi.fn()
      const { container } = render(
        <TimePicker value={mockValue} onChange={handleChange}>
          <TimePicker.Separator />
        </TimePicker>
      )

      expect(container.firstChild).toBeInTheDocument()
    })

    it('renders separator with custom children', () => {
      const handleChange = vi.fn()
      const { getByText } = render(
        <TimePicker value={mockValue} onChange={handleChange}>
          <TimePicker.Separator>to</TimePicker.Separator>
        </TimePicker>
      )

      expect(getByText('to')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const handleChange = vi.fn()
      const { container } = render(
        <TimePicker value={mockValue} onChange={handleChange}>
          <TimePicker.Separator className="custom-separator" />
        </TimePicker>
      )

      expect(container.firstChild).toHaveClass('custom-separator')
    })
  })

  describe('TimePicker compound components structure', () => {
    it('renders complete TimePicker structure', () => {
      const handleChange = vi.fn()
      const { container, getByText } = render(
        <TimePicker value={mockValue} onChange={handleChange}>
          <TimePicker.Range>
            <TimePicker.Input field="start" />
            <TimePicker.Separator>→</TimePicker.Separator>
            <TimePicker.Input field="end" />
          </TimePicker.Range>
        </TimePicker>
      )

      expect(container.querySelectorAll('input')).toHaveLength(2)
      expect(getByText('→')).toBeInTheDocument()
    })
  })
})
