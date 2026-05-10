import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Overlay } from './Overlay'

describe('Overlay', () => {
  beforeEach(() => {
    // 각 테스트 전에 body의 overflow를 초기화
    document.body.style.overflow = ''
  })

  afterEach(() => {
    // 각 테스트 후 cleanup
    document.body.style.overflow = ''
  })

  it('renders children when isOpen is true', () => {
    render(
      <Overlay isOpen>
        <div>Overlay content</div>
      </Overlay>
    )

    expect(document.body.textContent).toContain('Overlay content')
  })

  it('does not render when isOpen is false', () => {
    render(
      <Overlay isOpen={false}>
        <div>Hidden content</div>
      </Overlay>
    )

    expect(document.body.textContent).not.toContain('Hidden content')
  })

  it('has aria-modal attribute for accessibility', () => {
    render(
      <Overlay isOpen>
        <div>Modal content</div>
      </Overlay>
    )

    expect(document.querySelector('[aria-modal="true"]')).toBeInTheDocument()
  })

  it('has dialog role', () => {
    render(
      <Overlay isOpen>
        <div>Dialog content</div>
      </Overlay>
    )

    expect(document.querySelector('[role="dialog"]')).toBeInTheDocument()
  })

  it('applies custom ariaLabel', () => {
    render(
      <Overlay isOpen ariaLabel="Custom overlay">
        <div>Content</div>
      </Overlay>
    )

    expect(document.querySelector('[aria-label="Custom overlay"]')).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked directly', async () => {
    const handleClose = vi.fn()

    render(
      <Overlay isOpen onClose={handleClose}>
        <div>Content</div>
      </Overlay>
    )

    const backdrop = document.querySelector('[role="presentation"]') as HTMLElement
    // 직접 mousedown 이벤트를 시뮬레이션 (backdrop 자체를 target으로)
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    })
    Object.defineProperty(event, 'target', { value: backdrop })
    backdrop.dispatchEvent(event)

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when content is clicked', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()

    render(
      <Overlay isOpen onClose={handleClose}>
        <button>Click me</button>
      </Overlay>
    )

    const button = document.querySelector('button')!
    await user.click(button)

    expect(handleClose).not.toHaveBeenCalled()
  })

  it('does not call onClose when disableBackdropClick is true', async () => {
    const handleClose = vi.fn()

    render(
      <Overlay isOpen onClose={handleClose} disableBackdropClick>
        <div>Content</div>
      </Overlay>
    )

    const backdrop = document.querySelector('[role="presentation"]') as HTMLElement
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true
    })
    Object.defineProperty(event, 'target', { value: backdrop })
    backdrop.dispatchEvent(event)

    expect(handleClose).not.toHaveBeenCalled()
  })

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()

    render(
      <Overlay isOpen onClose={handleClose}>
        <div>Content</div>
      </Overlay>
    )

    await user.keyboard('{Escape}')

    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose on Escape when disableEscapeKey is true', async () => {
    const user = userEvent.setup()
    const handleClose = vi.fn()

    render(
      <Overlay isOpen onClose={handleClose} disableEscapeKey>
        <div>Content</div>
      </Overlay>
    )

    await user.keyboard('{Escape}')

    expect(handleClose).not.toHaveBeenCalled()
  })

  it('applies custom zIndex', () => {
    render(
      <Overlay isOpen zIndex={2000}>
        <div>Content</div>
      </Overlay>
    )

    const backdrop = document.querySelector('[role="presentation"]')!
    expect(backdrop).toHaveStyle({ zIndex: '2000' })
  })

  it('applies custom background opacity', () => {
    render(
      <Overlay isOpen backgroundOpacity={80}>
        <div>Content</div>
      </Overlay>
    )

    const backdrop = document.querySelector('[role="presentation"]')!
    expect(backdrop).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 0.8)' })
  })

  it('clamps background opacity between 0 and 100', () => {
    render(
      <Overlay isOpen backgroundOpacity={150}>
        <div>Content</div>
      </Overlay>
    )

    const backdrop = document.querySelector('[role="presentation"]')!
    expect(backdrop).toHaveStyle({ backgroundColor: 'rgba(0, 0, 0, 1)' })
  })

  it('applies custom backdropClassName', () => {
    render(
      <Overlay isOpen backdropClassName="custom-backdrop">
        <div>Content</div>
      </Overlay>
    )

    const backdrop = document.querySelector('[role="presentation"]')!
    expect(backdrop).toHaveClass('custom-backdrop')
  })

  it('applies custom contentClassName', () => {
    render(
      <Overlay isOpen contentClassName="custom-content">
        <div>Content</div>
      </Overlay>
    )

    const content = document.querySelector('[role="dialog"]')!
    expect(content).toHaveClass('custom-content')
  })

  it('sets body overflow to hidden when open', () => {
    render(
      <Overlay isOpen>
        <div>Content</div>
      </Overlay>
    )

    expect(document.body.style.overflow).toBe('hidden')
  })

  it('renders to custom container when provided', () => {
    const container = document.createElement('div')
    container.id = 'overlay-container'
    document.body.appendChild(container)

    render(
      <Overlay isOpen container={container}>
        <div>Portal content</div>
      </Overlay>
    )

    expect(container.textContent).toContain('Portal content')

    document.body.removeChild(container)
  })
})
