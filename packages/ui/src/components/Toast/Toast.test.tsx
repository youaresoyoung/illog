import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, act, fireEvent } from '@testing-library/react'
import { ToastItem, ToastContainer } from './Toast'

describe('ToastItem', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders message text', () => {
    render(<ToastItem id="1" type="error" message="Something went wrong" onClose={vi.fn()} />)

    expect(document.body.textContent).toContain('Something went wrong')
  })

  it('calls onClose with id when close button is clicked', () => {
    const handleClose = vi.fn()

    render(<ToastItem id="toast-1" type="info" message="Info message" onClose={handleClose} />)

    const closeButton = document.querySelector('[aria-label="Close notification"]') as HTMLElement
    fireEvent.click(closeButton)

    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(handleClose).toHaveBeenCalledWith('toast-1')
  })

  it('auto-dismisses after 4 seconds', () => {
    const handleClose = vi.fn()

    render(<ToastItem id="1" type="info" message="Auto dismiss" onClose={handleClose} />)

    act(() => {
      vi.advanceTimersByTime(4000 + 150)
    })

    expect(handleClose).toHaveBeenCalledWith('1')
  })

  it('has role="alert" for accessibility', () => {
    render(<ToastItem id="1" type="success" message="Done" onClose={vi.fn()} />)

    expect(document.querySelector('[role="alert"]')).toBeInTheDocument()
  })

  it('uses aria-live="assertive" for error type', () => {
    render(<ToastItem id="1" type="error" message="Error" onClose={vi.fn()} />)

    const alert = document.querySelector('[role="alert"]')
    expect(alert).toHaveAttribute('aria-live', 'assertive')
  })

  it('uses aria-live="polite" for non-error types', () => {
    render(<ToastItem id="1" type="success" message="Success" onClose={vi.fn()} />)

    const alert = document.querySelector('[role="alert"]')
    expect(alert).toHaveAttribute('aria-live', 'polite')
  })
})

describe('ToastContainer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing when toasts array is empty', () => {
    const { container } = render(<ToastContainer toasts={[]} onRemove={vi.fn()} />)

    expect(container.innerHTML).toBe('')
  })

  it('renders toast items for each toast', () => {
    const toasts = [
      { id: '1', type: 'error' as const, message: 'Error occurred' },
      { id: '2', type: 'success' as const, message: 'Task completed' }
    ]

    render(<ToastContainer toasts={toasts} onRemove={vi.fn()} />)

    expect(document.body.textContent).toContain('Error occurred')
    expect(document.body.textContent).toContain('Task completed')
  })

  it('calls onRemove when a toast close button is clicked', () => {
    const handleRemove = vi.fn()
    const toasts = [{ id: 'toast-1', type: 'info' as const, message: 'Info' }]

    render(<ToastContainer toasts={toasts} onRemove={handleRemove} />)

    const closeButton = document.querySelector('[aria-label="Close notification"]') as HTMLElement
    fireEvent.click(closeButton)

    act(() => {
      vi.advanceTimersByTime(150)
    })

    expect(handleRemove).toHaveBeenCalledWith('toast-1')
  })
})
