import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders as div element', () => {
    const { container } = render(<Divider />)

    expect(container.querySelector('div')).toBeInTheDocument()
  })

  it('applies horizontal orientation by default', () => {
    const { container } = render(<Divider />)

    const divider = container.firstChild as HTMLElement
    expect(divider).toHaveClass(/orientation_horizontal/)
  })

  it('applies vertical orientation when specified', () => {
    const { container } = render(<Divider orientation="vertical" />)

    const divider = container.firstChild as HTMLElement
    expect(divider).toHaveClass(/orientation_vertical/)
  })

  it('applies solid variant by default', () => {
    const { container } = render(<Divider />)

    const divider = container.firstChild as HTMLElement
    expect(divider).toHaveClass(/variant_solid/)
  })

  it('applies dashed variant when specified', () => {
    const { container } = render(<Divider variant="dashed" />)

    const divider = container.firstChild as HTMLElement
    expect(divider).toHaveClass(/variant_dashed/)
  })

  it('applies default color by default', () => {
    const { container } = render(<Divider />)

    const divider = container.firstChild as HTMLElement
    expect(divider).toHaveClass(/color_default/)
  })

  it('applies thin thickness by default', () => {
    const { container } = render(<Divider />)

    const divider = container.firstChild as HTMLElement
    expect(divider).toHaveClass(/thickness_thin/)
  })

  it('applies custom className', () => {
    const { container } = render(<Divider className="custom-divider" />)

    expect(container.firstChild).toHaveClass('custom-divider')
  })

  it('spreads rest props to the element', () => {
    const { getByTestId } = render(<Divider data-testid="test-divider" />)

    expect(getByTestId('test-divider')).toBeInTheDocument()
  })

  it('combines multiple variant props', () => {
    const { container } = render(<Divider orientation="vertical" variant="dashed" />)

    const divider = container.firstChild as HTMLElement
    expect(divider).toHaveClass(/orientation_vertical/)
    expect(divider).toHaveClass(/variant_dashed/)
  })
})
