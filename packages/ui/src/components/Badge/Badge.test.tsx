import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Badge } from './Badge'
import { BadgeItem, OmittedBadgeItem } from './types'

describe('Badge', () => {
  const mockItem: BadgeItem = {
    id: 'item-1',
    name: 'My Project',
    color: 'blue',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  }

  const mockOmittedItem: OmittedBadgeItem = {
    name: 'Select Project',
    color: 'gray'
  }

  describe('display mode (basic badge)', () => {
    it('renders item name', () => {
      const { getByText } = render(<Badge item={mockItem} />)

      expect(getByText('My Project')).toBeInTheDocument()
    })

    it('applies color variant class', () => {
      const { container } = render(<Badge item={mockItem} />)

      const badge = container.firstChild as HTMLElement
      expect(badge).toHaveClass(/color_blue/)
    })

    it('renders chevron down icon', () => {
      const { container } = render(<Badge item={mockItem} />)

      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('rotates chevron icon when isOpenedSelector is true', () => {
      const { container } = render(<Badge item={mockItem} isOpenedSelector />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveStyle({ transform: 'rotate(180deg)' })
    })

    it('does not rotate chevron icon when isOpenedSelector is false', () => {
      const { container } = render(<Badge item={mockItem} isOpenedSelector={false} />)

      const icon = container.querySelector('svg')
      expect(icon).toHaveStyle({ transform: '' })
    })

    it('applies custom className', () => {
      const { container } = render(<Badge item={mockItem} className="custom-badge" />)

      expect(container.firstChild).toHaveClass('custom-badge')
    })
  })

  describe('selector button mode (with addButtonVariant)', () => {
    it('renders as button when addButtonVariant is provided', () => {
      const handleOpen = vi.fn()
      const { getByRole } = render(
        <Badge item={mockOmittedItem} openSelector={handleOpen} addButtonVariant="default" />
      )

      expect(getByRole('button')).toBeInTheDocument()
    })

    it('renders item name in button', () => {
      const handleOpen = vi.fn()
      const { getByText } = render(
        <Badge item={mockOmittedItem} openSelector={handleOpen} addButtonVariant="default" />
      )

      expect(getByText('Select Project')).toBeInTheDocument()
    })

    it('renders chevron icon in button', () => {
      const handleOpen = vi.fn()
      const { container } = render(
        <Badge item={mockOmittedItem} openSelector={handleOpen} addButtonVariant="default" />
      )

      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('calls openSelector when button is clicked', async () => {
      const user = userEvent.setup()
      const handleOpen = vi.fn()
      const { getByRole } = render(
        <Badge item={mockOmittedItem} openSelector={handleOpen} addButtonVariant="default" />
      )

      await user.click(getByRole('button'))

      expect(handleOpen).toHaveBeenCalledTimes(1)
    })

    it('applies default variant class', () => {
      const handleOpen = vi.fn()
      const { getByRole } = render(
        <Badge item={mockOmittedItem} openSelector={handleOpen} addButtonVariant="default" />
      )

      expect(getByRole('button')).toHaveClass(/variant_default/)
    })

    it('applies error variant class when specified', () => {
      const handleOpen = vi.fn()
      const { getByRole } = render(
        <Badge item={mockOmittedItem} openSelector={handleOpen} addButtonVariant="error" />
      )

      expect(getByRole('button')).toHaveClass(/variant_error/)
    })

    it('rotates chevron when isOpenedSelector is true', () => {
      const handleOpen = vi.fn()
      const { container } = render(
        <Badge
          item={mockOmittedItem}
          openSelector={handleOpen}
          addButtonVariant="default"
          isOpenedSelector
        />
      )

      const icon = container.querySelector('svg')
      expect(icon).toHaveStyle({ transform: 'rotate(180deg)' })
    })
  })

  describe('removable mode (with onRemove)', () => {
    it('renders item name', () => {
      const handleRemove = vi.fn()
      const { getByText } = render(<Badge item={mockItem} onRemove={handleRemove} />)

      expect(getByText('My Project')).toBeInTheDocument()
    })

    it('renders remove button with aria-label', () => {
      const handleRemove = vi.fn()
      const { getByLabelText } = render(<Badge item={mockItem} onRemove={handleRemove} />)

      expect(getByLabelText('Remove My Project')).toBeInTheDocument()
    })

    it('calls onRemove when remove button is clicked', async () => {
      const user = userEvent.setup()
      const handleRemove = vi.fn()
      const { getByLabelText } = render(<Badge item={mockItem} onRemove={handleRemove} />)

      await user.click(getByLabelText('Remove My Project'))

      expect(handleRemove).toHaveBeenCalledTimes(1)
    })

    it('stops event propagation when remove button is clicked', async () => {
      const user = userEvent.setup()
      const handleRemove = vi.fn()
      const handleParentClick = vi.fn()

      const { getByLabelText } = render(
        <div onClick={handleParentClick}>
          <Badge item={mockItem} onRemove={handleRemove} />
        </div>
      )

      await user.click(getByLabelText('Remove My Project'))

      expect(handleRemove).toHaveBeenCalled()
      expect(handleParentClick).not.toHaveBeenCalled()
    })
  })

  describe('different badge colors', () => {
    const colors = ['blue', 'gray', 'green', 'purple', 'red', 'yellow'] as const

    colors.forEach((color) => {
      it(`renders badge with ${color} color`, () => {
        const item: BadgeItem = { ...mockItem, color }
        const { container } = render(<Badge item={item} />)

        const badge = container.firstChild as HTMLElement
        expect(badge).toHaveClass(new RegExp(`color_${color}`))
      })
    })
  })
})
