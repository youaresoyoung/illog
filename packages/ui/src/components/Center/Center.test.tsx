import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Center } from './Center'

describe('Center', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<Center>Centered content</Center>)

    expect(getByText('Centered content')).toBeInTheDocument()
  })

  it('renders as div by default', () => {
    const { container } = render(<Center>Center content</Center>)

    expect(container.querySelector('div')).toBeInTheDocument()
  })

  it('renders as different element with as prop', () => {
    const { container } = render(<Center as="main">Main content</Center>)

    expect(container.querySelector('main')).toBeInTheDocument()
  })

  it('applies flex display', () => {
    const { container } = render(<Center>Flex center</Center>)

    const center = container.firstChild as HTMLElement
    expect(center).toHaveClass(/display_flex/)
  })

  it('applies center alignment', () => {
    const { container } = render(<Center>Aligned center</Center>)

    const center = container.firstChild as HTMLElement
    expect(center).toHaveClass(/alignItems_center/)
    expect(center).toHaveClass(/justifyContent_center/)
  })

  it('applies custom className', () => {
    const { container } = render(<Center className="custom-center">Styled</Center>)

    expect(container.firstChild).toHaveClass('custom-center')
  })

  it('applies inline style', () => {
    const { container } = render(<Center style={{ width: '100%' }}>Full width</Center>)

    expect(container.firstChild).toHaveStyle({ width: '100%' })
  })

  it('spreads rest props to the element', () => {
    const { getByTestId } = render(<Center data-testid="test-center">Test</Center>)

    expect(getByTestId('test-center')).toBeInTheDocument()
  })

  it('centers nested children', () => {
    const { getByText, container } = render(
      <Center>
        <span>Child 1</span>
        <span>Child 2</span>
      </Center>
    )

    expect(getByText('Child 1')).toBeInTheDocument()
    expect(getByText('Child 2')).toBeInTheDocument()

    const center = container.firstChild as HTMLElement
    expect(center).toHaveClass(/alignItems_center/)
  })
})
