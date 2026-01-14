import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Text } from './Text'

describe('Text', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Text>Hello World</Text>)

    expect(getByText('Hello World')).toBeInTheDocument()
  })

  it('renders as paragraph by default', () => {
    const { container } = render(<Text>Default paragraph</Text>)

    expect(container.querySelector('p')).toBeInTheDocument()
  })

  it('renders as different element with as prop', () => {
    const { container } = render(<Text as="span">Span text</Text>)

    expect(container.querySelector('span')).toBeInTheDocument()
    expect(container.querySelector('p')).not.toBeInTheDocument()
  })

  it('renders as heading element', () => {
    const { container, getByRole } = render(<Text as="h1">Heading text</Text>)

    expect(container.querySelector('h1')).toBeInTheDocument()
    expect(getByRole('heading', { level: 1 })).toHaveTextContent('Heading text')
  })

  it('applies custom className', () => {
    const { getByText } = render(<Text className="custom-class">Styled text</Text>)

    expect(getByText('Styled text')).toHaveClass('custom-class')
  })

  it('applies textStyle variant class', () => {
    const { getByText } = render(<Text textStyle="heading">Large heading</Text>)

    const element = getByText('Large heading')

    expect(element).toBeInTheDocument()
  })

  it('applies inline style', () => {
    const { getByText } = render(<Text style={{ marginTop: '10px' }}>Styled text</Text>)

    expect(getByText('Styled text')).toHaveStyle({ marginTop: '10px' })
  })

  it('spreads rest props to the element', () => {
    const { getByTestId } = render(<Text data-testid="test-text">Test</Text>)

    expect(getByTestId('test-text')).toBeInTheDocument()
  })
})
