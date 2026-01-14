import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Stack } from './Stack'
import { createRef } from 'react'

describe('Stack', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Stack>
        <span>Item 1</span>
        <span>Item 2</span>
      </Stack>
    )

    expect(getByText('Item 1')).toBeInTheDocument()
    expect(getByText('Item 2')).toBeInTheDocument()
  })

  it('renders as div by default', () => {
    const { container } = render(<Stack>Stack content</Stack>)

    expect(container.querySelector('div')).toBeInTheDocument()
  })

  it('renders as different element with as prop', () => {
    const { container } = render(<Stack as="ul">List stack</Stack>)

    expect(container.querySelector('ul')).toBeInTheDocument()
  })

  it('applies flex display', () => {
    const { container } = render(<Stack>Flex stack</Stack>)

    const stack = container.firstChild as HTMLElement
    expect(stack).toHaveClass(/display_flex/)
  })

  it('applies column direction by default', () => {
    const { container } = render(<Stack>Column stack</Stack>)

    const stack = container.firstChild as HTMLElement
    expect(stack).toHaveClass(/flexDirection_column/)
  })

  it('applies row direction when specified', () => {
    const { container } = render(<Stack direction="row">Row stack</Stack>)

    const stack = container.firstChild as HTMLElement
    expect(stack).toHaveClass(/flexDirection_row/)
  })

  it('applies custom className', () => {
    const { container } = render(<Stack className="custom-stack">Styled</Stack>)

    expect(container.firstChild).toHaveClass('custom-stack')
  })

  it('applies inline style', () => {
    const { container } = render(<Stack style={{ padding: '10px' }}>Styled stack</Stack>)

    expect(container.firstChild).toHaveStyle({ padding: '10px' })
  })

  it('spreads rest props to the element', () => {
    const { getByTestId } = render(<Stack data-testid="test-stack">Test</Stack>)

    expect(getByTestId('test-stack')).toBeInTheDocument()
  })

  it('forwards ref to the element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Stack ref={ref}>With ref</Stack>)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies nowrap by default', () => {
    const { container } = render(<Stack>Nowrap stack</Stack>)

    const stack = container.firstChild as HTMLElement
    expect(stack).toHaveClass(/flexWrap_nowrap/)
  })

  it('applies wrap when specified', () => {
    const { container } = render(<Stack wrap="wrap">Wrap stack</Stack>)

    const stack = container.firstChild as HTMLElement
    expect(stack).toHaveClass(/flexWrap_wrap/)
  })
})
