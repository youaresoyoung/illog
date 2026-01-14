import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Dialog } from './Dialog'

describe('Dialog', () => {
  const noop = vi.fn()

  describe('Dialog.Root', () => {
    it('renders children when isOpen is true', () => {
      render(
        <Dialog isOpen onClose={noop}>
          <div>Dialog content</div>
        </Dialog>
      )

      expect(document.body.textContent).toContain('Dialog content')
    })

    it('does not render when isOpen is false', () => {
      render(
        <Dialog isOpen={false} onClose={noop}>
          <div>Hidden content</div>
        </Dialog>
      )

      expect(document.body.textContent).not.toContain('Hidden content')
    })

    it('renders as dialog element', () => {
      render(
        <Dialog isOpen onClose={noop}>
          <div>Dialog</div>
        </Dialog>
      )

      expect(document.querySelector('dialog')).toBeInTheDocument()
    })

    it('has dialog role by default', () => {
      render(
        <Dialog isOpen onClose={noop}>
          <div>Dialog</div>
        </Dialog>
      )

      expect(document.querySelector('[role="dialog"]')).toBeInTheDocument()
    })

    it('applies custom role', () => {
      render(
        <Dialog isOpen onClose={noop} role="alertdialog">
          <div>Alert</div>
        </Dialog>
      )

      expect(document.querySelector('[role="alertdialog"]')).toBeInTheDocument()
    })

    it('applies aria-label', () => {
      render(
        <Dialog isOpen onClose={noop} ariaLabel="Test dialog">
          <div>Content</div>
        </Dialog>
      )

      expect(document.querySelector('[aria-label="Test dialog"]')).toBeInTheDocument()
    })

    it('applies aria-describedby', () => {
      render(
        <Dialog isOpen onClose={noop} ariaDescribedby="description-id">
          <div id="description-id">Description</div>
        </Dialog>
      )

      expect(document.querySelector('[aria-describedby="description-id"]')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      render(
        <Dialog isOpen onClose={noop} className="custom-dialog">
          <div>Content</div>
        </Dialog>
      )

      expect(document.querySelector('dialog')).toHaveClass('custom-dialog')
    })

    it('renders through Portal', () => {
      render(
        <Dialog isOpen onClose={noop}>
          <div data-testid="dialog-content">Portal content</div>
        </Dialog>
      )

      // Portal renders directly to body
      const content = document.querySelector('[data-testid="dialog-content"]')
      expect(content).toBeInTheDocument()
    })
  })

  describe('Dialog.Title', () => {
    it('renders title text', () => {
      render(
        <Dialog isOpen onClose={noop}>
          <Dialog.Title>Dialog Title</Dialog.Title>
        </Dialog>
      )

      expect(document.body.textContent).toContain('Dialog Title')
    })
  })

  describe('Dialog.Content', () => {
    it('renders content', () => {
      render(
        <Dialog isOpen onClose={noop}>
          <Dialog.Content>Dialog body content</Dialog.Content>
        </Dialog>
      )

      expect(document.body.textContent).toContain('Dialog body content')
    })
  })

  describe('Dialog.Description', () => {
    it('renders description text', () => {
      render(
        <Dialog isOpen onClose={noop}>
          <Dialog.Description>This is a description</Dialog.Description>
        </Dialog>
      )

      expect(document.body.textContent).toContain('This is a description')
    })
  })

  describe('Dialog.Footer', () => {
    it('renders footer content', () => {
      render(
        <Dialog isOpen onClose={noop}>
          <Dialog.Footer>
            <button>Cancel</button>
            <button>Confirm</button>
          </Dialog.Footer>
        </Dialog>
      )

      expect(document.body.textContent).toContain('Cancel')
      expect(document.body.textContent).toContain('Confirm')
    })
  })

  describe('compound component pattern', () => {
    it('renders complete dialog structure', () => {
      render(
        <Dialog isOpen onClose={noop} ariaLabel="Complete dialog">
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.Description>Description text</Dialog.Description>
          <Dialog.Content>
            <p>Main content here</p>
          </Dialog.Content>
          <Dialog.Footer>
            <button>Close</button>
          </Dialog.Footer>
        </Dialog>
      )

      expect(document.body.textContent).toContain('Title')
      expect(document.body.textContent).toContain('Description text')
      expect(document.body.textContent).toContain('Main content here')
      expect(document.body.textContent).toContain('Close')
    })
  })
})
