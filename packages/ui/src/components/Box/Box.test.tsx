import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Box } from './Box'
import { createRef } from 'react'

describe('Box', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Box>Box content</Box>)

    expect(getByText('Box content')).toBeInTheDocument()
  })

  it('renders as div by default', () => {
    const { container } = render(<Box>Default div</Box>)

    expect(container.querySelector('div')).toBeInTheDocument()
  })

  it('renders as different element with as prop', () => {
    const { container } = render(<Box as="section">Section content</Box>)

    expect(container.querySelector('section')).toBeInTheDocument()
    expect(container.querySelector('section')).toHaveTextContent('Section content')
  })

  it('renders as button element', () => {
    const { getByRole } = render(<Box as="button">Click me</Box>)

    expect(getByRole('button')).toHaveTextContent('Click me')
  })

  it('applies custom className', () => {
    const { getByText } = render(<Box className="custom-box">Styled box</Box>)

    expect(getByText('Styled box')).toHaveClass('custom-box')
  })

  it('applies inline style', () => {
    const { getByText } = render(<Box style={{ backgroundColor: 'red' }}>Red box</Box>)

    expect(getByText('Red box')).toHaveStyle({ backgroundColor: 'red;' })
  })

  it('spreads rest props to the element', () => {
    const { getByTestId } = render(<Box data-testid="test-box">Test</Box>)

    expect(getByTestId('test-box')).toBeInTheDocument()
  })

  it('forwards ref to the element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Box ref={ref}>With ref</Box>)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current?.textContent).toBe('With ref')
  })

  it('renders nested children', () => {
    const { getByText, container } = render(
      <Box>
        <span>Child 1</span>
        <span>Child 2</span>
      </Box>
    )

    expect(getByText('Child 1')).toBeInTheDocument()
    expect(getByText('Child 2')).toBeInTheDocument()
    expect(container.querySelectorAll('span')).toHaveLength(2)
  })
})
