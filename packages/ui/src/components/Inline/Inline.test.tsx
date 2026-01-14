import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Inline } from './Inline'

describe('Inline', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Inline>
        <span>Item 1</span>
        <span>Item 2</span>
      </Inline>
    )

    expect(getByText('Item 1')).toBeInTheDocument()
    expect(getByText('Item 2')).toBeInTheDocument()
  })

  it('renders as div by default', () => {
    const { container } = render(<Inline>Inline content</Inline>)

    expect(container.querySelector('div')).toBeInTheDocument()
  })

  it('renders as different element with as prop', () => {
    const { container } = render(<Inline as="nav">Navigation</Inline>)

    expect(container.querySelector('nav')).toBeInTheDocument()
  })

  it('applies flex display', () => {
    const { container } = render(<Inline>Flex inline</Inline>)

    const inline = container.firstChild as HTMLElement
    expect(inline).toHaveClass(/display_flex/)
  })

  it('applies row direction (horizontal layout)', () => {
    const { container } = render(<Inline>Row layout</Inline>)

    const inline = container.firstChild as HTMLElement
    expect(inline).toHaveClass(/flexDirection_row/)
  })

  it('applies custom className', () => {
    const { container } = render(<Inline className="custom-inline">Styled</Inline>)

    expect(container.firstChild).toHaveClass('custom-inline')
  })

  it('applies inline style', () => {
    const { container } = render(<Inline style={{ margin: '5px' }}>Styled inline</Inline>)

    expect(container.firstChild).toHaveStyle({ margin: '5px' })
  })

  it('spreads rest props to the element', () => {
    const { getByTestId } = render(<Inline data-testid="test-inline">Test</Inline>)

    expect(getByTestId('test-inline')).toBeInTheDocument()
  })

  it('applies nowrap by default', () => {
    const { container } = render(<Inline>Nowrap inline</Inline>)

    const inline = container.firstChild as HTMLElement
    expect(inline).toHaveClass(/flexWrap_nowrap/)
  })

  it('applies wrap when specified', () => {
    const { container } = render(<Inline wrap="wrap">Wrap inline</Inline>)

    const inline = container.firstChild as HTMLElement
    expect(inline).toHaveClass(/flexWrap_wrap/)
  })
})
