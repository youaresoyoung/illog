import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tag } from './Tag'
import { TagType, OmittedTag } from './types'

/**
 * dispaly mode:
 * - tag in the list (without openTagSelector)
 * - tag in the tag section
 * */

describe('Tag', () => {
  const mockTag: TagType = {
    id: 'tag-1',
    name: 'meeting',
    color: 'blue',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  }

  const mockOmittedTag: OmittedTag = {
    name: 'Add Tag',
    color: 'gray'
  }

  describe('display mode (without openTagSelector)', () => {
    it('renders tag name', () => {
      const { getByText } = render(<Tag tag={mockTag} />)

      expect(getByText('meeting')).toBeInTheDocument()
    })

    it('applies color variant class', () => {
      const { container } = render(<Tag tag={mockTag} />)

      const tagElement = container.firstChild as HTMLElement
      expect(tagElement).toHaveClass(/color_blue/)
    })

    it('applies custom className', () => {
      const { container } = render(<Tag tag={mockTag} className="custom-tag" />)

      expect(container.firstChild).toHaveClass('custom-tag')
    })

    it('does not show remove button when removeFromTask is not provided', () => {
      const { container } = render(<Tag tag={mockTag} />)

      expect(container.querySelector('button')).not.toBeInTheDocument()
    })

    it('shows remove button when removeFromTask is provided', () => {
      const handleRemove = vi.fn()
      const { getByRole } = render(<Tag tag={mockTag} removeFromTask={handleRemove} />)

      expect(getByRole('button')).toBeInTheDocument()
    })

    it('calls removeFromTask with tag id when remove button is clicked', async () => {
      const user = userEvent.setup()
      const handleRemove = vi.fn()
      const { getByRole } = render(<Tag tag={mockTag} removeFromTask={handleRemove} />)

      await user.click(getByRole('button'))

      expect(handleRemove).toHaveBeenCalledWith('tag-1')
    })

    it('stops event propagation when remove button is clicked', async () => {
      const user = userEvent.setup()
      const handleRemove = vi.fn()
      const handleParentClick = vi.fn()

      const { getByRole } = render(
        <div onClick={handleParentClick}>
          <Tag tag={mockTag} removeFromTask={handleRemove} />
        </div>
      )

      await user.click(getByRole('button'))

      expect(handleRemove).toHaveBeenCalled()
      expect(handleParentClick).not.toHaveBeenCalled()
    })
  })

  describe('add tag button mode (with addTagButtonVariant)', () => {
    it('renders as button when addTagButtonVariant is provided', () => {
      const handleOpen = vi.fn()
      const { getByRole } = render(
        <Tag tag={mockOmittedTag} openTagSelector={handleOpen} addTagButtonVariant="default" />
      )

      expect(getByRole('button')).toBeInTheDocument()
    })

    it('renders tag name in button', () => {
      const handleOpen = vi.fn()
      const { getByText } = render(
        <Tag tag={mockOmittedTag} openTagSelector={handleOpen} addTagButtonVariant="default" />
      )

      expect(getByText('Add Tag')).toBeInTheDocument()
    })

    it('renders plus icon in button', () => {
      const handleOpen = vi.fn()
      const { container } = render(
        <Tag tag={mockOmittedTag} openTagSelector={handleOpen} addTagButtonVariant="default" />
      )

      expect(container.querySelector('svg')).toBeInTheDocument()
    })

    it('calls openTagSelector when button is clicked', async () => {
      const user = userEvent.setup()
      const handleOpen = vi.fn()
      const { getByRole } = render(
        <Tag tag={mockOmittedTag} openTagSelector={handleOpen} addTagButtonVariant="default" />
      )

      await user.click(getByRole('button'))

      expect(handleOpen).toHaveBeenCalledTimes(1)
    })

    it('applies default variant class', () => {
      const handleOpen = vi.fn()
      const { getByRole } = render(
        <Tag tag={mockOmittedTag} openTagSelector={handleOpen} addTagButtonVariant="default" />
      )

      expect(getByRole('button')).toHaveClass(/variant_default/)
    })

    it('applies error variant class when specified', () => {
      const handleOpen = vi.fn()
      const { getByRole } = render(
        <Tag tag={mockOmittedTag} openTagSelector={handleOpen} addTagButtonVariant="error" />
      )

      expect(getByRole('button')).toHaveClass(/variant_error/)
    })

    it('applies custom className to button', () => {
      const handleOpen = vi.fn()
      const { getByRole } = render(
        <Tag
          tag={mockOmittedTag}
          openTagSelector={handleOpen}
          addTagButtonVariant="default"
          className="custom-button"
        />
      )

      expect(getByRole('button')).toHaveClass('custom-button')
    })
  })

  describe('different tag colors', () => {
    const colors = ['blue', 'gray', 'green', 'purple', 'red', 'yellow'] as const

    colors.forEach((color) => {
      it(`renders tag with ${color} color`, () => {
        const tag: TagType = { ...mockTag, color }
        const { container } = render(<Tag tag={tag} />)

        const tagElement = container.firstChild as HTMLElement
        expect(tagElement).toHaveClass(new RegExp(`color_${color}`))
      })
    })
  })
})
