import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Card } from './Card'

describe('Card', () => {
  const noop = vi.fn()

  it('renders children correctly', () => {
    const { getByText } = render(<Card onClick={noop}>Card content</Card>)

    expect(getByText('Card content')).toBeInTheDocument()
  })

  it('renders as list item (li) element', () => {
    const { container } = render(<Card onClick={noop}>List item card</Card>)

    expect(container.querySelector('li')).toBeInTheDocument()
  })

  it('has button role for interactivity', () => {
    const { getByRole } = render(<Card onClick={noop}>Interactive card</Card>)

    expect(getByRole('button')).toBeInTheDocument()
  })

  it('is focusable with tabindex', () => {
    const { getByRole } = render(<Card onClick={noop}>Focusable card</Card>)

    expect(getByRole('button')).toHaveAttribute('tabindex', '0')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    const { getByRole } = render(<Card onClick={handleClick}>Clickable card</Card>)

    await user.click(getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies custom className', () => {
    const { getByRole } = render(
      <Card onClick={noop} className="custom-card">
        Styled card
      </Card>
    )

    expect(getByRole('button')).toHaveClass('custom-card')
  })

  it('applies maxWidth when provided', () => {
    const { getByRole } = render(
      <Card onClick={noop} maxWidth="300px">
        Limited width card
      </Card>
    )

    expect(getByRole('button')).toHaveStyle({ maxWidth: '300px' })
  })

  it('renders nested content', () => {
    const { getByText } = render(
      <Card onClick={noop}>
        <h3>Card Title</h3>
        <p>Card description</p>
      </Card>
    )

    expect(getByText('Card Title')).toBeInTheDocument()
    expect(getByText('Card description')).toBeInTheDocument()
  })

  it('applies flex column layout', () => {
    const { getByRole } = render(<Card onClick={noop}>Flex card</Card>)

    const card = getByRole('button')
    expect(card).toHaveClass(/display_flex/)
    expect(card).toHaveClass(/flexDirection_column/)
  })
})
