import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Portal } from './Portal'

describe('Portal', () => {
  it('renders children to document body by default', () => {
    render(<Portal>Portal content</Portal>)

    expect(document.body.textContent).toContain('Portal content')
  })

  it('renders children to specified container', () => {
    const container = document.createElement('div')
    container.id = 'portal-container'
    document.body.appendChild(container)

    render(<Portal container={container}>Custom container content</Portal>)

    expect(container.textContent).toContain('Custom container content')

    document.body.removeChild(container)
  })

  it('returns null when children is null', () => {
    const { container } = render(<Portal>{null}</Portal>)

    expect(container.innerHTML).toBe('')
  })

  it('returns null when children is undefined', () => {
    const { container } = render(<Portal>{undefined}</Portal>)

    expect(container.innerHTML).toBe('')
  })

  it('renders multiple children', () => {
    render(
      <Portal>
        <span>Child 1</span>
        <span>Child 2</span>
      </Portal>
    )

    expect(document.body.textContent).toContain('Child 1')
    expect(document.body.textContent).toContain('Child 2')
  })

  it('renders nested elements correctly', () => {
    render(
      <Portal>
        <div>
          <span>Nested content</span>
        </div>
      </Portal>
    )

    expect(document.body.textContent).toContain('Nested content')
  })

  it('unmounts content when component unmounts', () => {
    const { unmount } = render(<Portal>Unmount test</Portal>)

    expect(document.body.textContent).toContain('Unmount test')

    unmount()

    expect(document.body.textContent).not.toContain('Unmount test')
  })

  it('renders React components as children', () => {
    const TestComponent = () => <div data-testid="test-component">Test</div>

    render(
      <Portal>
        <TestComponent />
      </Portal>
    )

    expect(document.querySelector('[data-testid="test-component"]')).toBeInTheDocument()
  })
})
