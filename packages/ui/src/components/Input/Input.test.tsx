import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'
import { createRef } from 'react'

describe('Input', () => {
  it('renders input element', () => {
    const { getByRole } = render(<Input />)

    expect(getByRole('textbox')).toBeInTheDocument()
  })

  it('renders with default type text', () => {
    const { getByRole } = render(<Input />)

    expect(getByRole('textbox')).toHaveAttribute('type', 'text')
  })

  it('renders with specified type', () => {
    const { container } = render(<Input type="email" />)

    expect(container.querySelector('input')).toHaveAttribute('type', 'email')
  })

  it('renders with name attribute', () => {
    const { getByRole } = render(<Input name="username" />)

    expect(getByRole('textbox')).toHaveAttribute('name', 'username')
  })

  it('renders with value', () => {
    const { getByRole } = render(<Input value="test value" onChange={() => {}} />)

    expect(getByRole('textbox')).toHaveValue('test value')
  })

  it('applies correct variant class', () => {
    const { getByRole } = render(<Input variant="error" />)

    expect(getByRole('textbox')).toHaveClass(/variant_error/)
  })

  it('applies full width class when isFullWidth is true', () => {
    const { getByRole } = render(<Input isFullWidth />)

    expect(getByRole('textbox')).toHaveClass(/isFullWidth_true/)
  })

  it('sets disabled when isDisabled is true', () => {
    const { getByRole } = render(<Input isDisabled />)

    expect(getByRole('textbox')).toBeDisabled()
  })

  it('displays error message when provided', () => {
    const { getByText } = render(<Input errorMessage="This field is required" />)

    expect(getByText('This field is required')).toBeInTheDocument()
  })

  it('does not display error message when not provided', () => {
    const { container } = render(<Input />)

    const errorSpan = container.querySelector('span')
    expect(errorSpan).not.toBeInTheDocument()
  })

  it('calls onChange when typing', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    const { getByRole } = render(<Input onChange={handleChange} />)

    await user.type(getByRole('textbox'), 'hello')

    expect(handleChange).toHaveBeenCalled()
  })

  it('applies custom className', () => {
    const { getByRole } = render(<Input className="custom-input" />)

    expect(getByRole('textbox')).toHaveClass('custom-input')
  })

  it('forwards ref to the input element', () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('spreads rest props to the input element', () => {
    const { getByRole } = render(<Input placeholder="Enter text" />)

    expect(getByRole('textbox')).toHaveAttribute('placeholder', 'Enter text')
  })

  it('wraps input in a div', () => {
    const { container } = render(<Input />)

    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.tagName).toBe('DIV')
    expect(wrapper.querySelector('input')).toBeInTheDocument()
  })
})
