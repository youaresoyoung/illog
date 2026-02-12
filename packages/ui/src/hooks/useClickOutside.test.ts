import { renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { vi, describe, it, expect, beforeEach, afterEach, Mock } from 'vitest'
import { useClickOutside } from './useClickOutside'

const createMockElement = (id: string): HTMLElement => {
  const element = document.createElement('div')
  element.setAttribute('data-testid', id)
  document.body.appendChild(element)
  return element
}

describe('useClickOutside', () => {
  let container: HTMLElement
  let trigger: HTMLElement
  let outside: HTMLElement
  let onClickOutside: Mock<() => void>

  beforeEach(() => {
    container = createMockElement('container')
    trigger = createMockElement('trigger')
    outside = createMockElement('outside')
    onClickOutside = vi.fn<() => void>()
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.clearAllMocks()
  })

  it('should call onClickOutside when clicking outside all refs', () => {
    renderHook(() => {
      const containerRef = useRef<HTMLElement>(container)
      const triggerRef = useRef<HTMLElement>(trigger)

      useClickOutside({
        refs: [containerRef, triggerRef],
        onClickOutside
      })

      return { containerRef, triggerRef }
    })

    const event = new MouseEvent('mousedown', { bubbles: true })
    outside.dispatchEvent(event)

    expect(onClickOutside).toHaveBeenCalledTimes(1)
  })

  it('should NOT call onClickOutside when clicking inside container ref', () => {
    renderHook(() => {
      const containerRef = useRef<HTMLElement>(container)

      useClickOutside({
        refs: [containerRef],
        onClickOutside
      })

      return { containerRef }
    })

    const event = new MouseEvent('mousedown', { bubbles: true })
    container.dispatchEvent(event)

    expect(onClickOutside).not.toHaveBeenCalled()
  })

  it('should NOT call onClickOutside when clicking inside trigger ref', () => {
    renderHook(() => {
      const containerRef = useRef<HTMLElement>(container)
      const triggerRef = useRef<HTMLElement>(trigger)

      useClickOutside({
        refs: [containerRef, triggerRef],
        onClickOutside
      })

      return { containerRef, triggerRef }
    })

    const event = new MouseEvent('mousedown', { bubbles: true })
    trigger.dispatchEvent(event)

    expect(onClickOutside).not.toHaveBeenCalled()
  })

  it('should NOT call onClickOutside when clicking element matching excludeSelectors', () => {
    const editorElement = createMockElement('editor')
    editorElement.setAttribute('data-editor-root', 'true')

    renderHook(() => {
      const containerRef = useRef<HTMLElement>(container)

      useClickOutside({
        refs: [containerRef],
        excludeSelectors: ['[data-editor-root]'],
        onClickOutside
      })

      return { containerRef }
    })

    const event = new MouseEvent('mousedown', { bubbles: true })
    editorElement.dispatchEvent(event)

    expect(onClickOutside).not.toHaveBeenCalled()
  })

  it('should NOT call onClickOutside when enabled is false', () => {
    renderHook(() => {
      const containerRef = useRef<HTMLElement>(container)

      useClickOutside({
        refs: [containerRef],
        onClickOutside,
        enabled: false
      })

      return { containerRef }
    })

    const event = new MouseEvent('mousedown', { bubbles: true })
    outside.dispatchEvent(event)

    expect(onClickOutside).not.toHaveBeenCalled()
  })

  it('should default enabled to true', () => {
    renderHook(() => {
      const containerRef = useRef<HTMLElement>(container)

      useClickOutside({
        refs: [containerRef],
        onClickOutside
      })

      return { containerRef }
    })

    const event = new MouseEvent('mousedown', { bubbles: true })
    outside.dispatchEvent(event)

    expect(onClickOutside).toHaveBeenCalledTimes(1)
  })

  it('should handle null refs gracefully', () => {
    renderHook(() => {
      const nullRef = useRef<HTMLElement>(null)

      useClickOutside({
        refs: [nullRef],
        onClickOutside
      })

      return { nullRef }
    })

    const event = new MouseEvent('mousedown', { bubbles: true })
    outside.dispatchEvent(event)

    expect(onClickOutside).toHaveBeenCalledTimes(1)
  })

  it('should cleanup event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    const { unmount } = renderHook(() => {
      const containerRef = useRef<HTMLElement>(container)

      useClickOutside({
        refs: [containerRef],
        onClickOutside
      })

      return { containerRef }
    })

    unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    removeEventListenerSpy.mockRestore()
  })

  it('should handle nested elements - click on child of ref should NOT trigger', () => {
    const child = document.createElement('span')
    container.appendChild(child)

    renderHook(() => {
      const containerRef = useRef<HTMLElement>(container)

      useClickOutside({
        refs: [containerRef],
        onClickOutside
      })

      return { containerRef }
    })

    const event = new MouseEvent('mousedown', { bubbles: true })
    child.dispatchEvent(event)

    expect(onClickOutside).not.toHaveBeenCalled()
  })

  it('should handle multiple excludeSelectors', () => {
    const editor = createMockElement('editor')
    editor.setAttribute('data-editor-root', 'true')

    const modal = createMockElement('modal')
    modal.setAttribute('data-modal', 'true')

    renderHook(() => {
      const containerRef = useRef<HTMLElement>(container)

      useClickOutside({
        refs: [containerRef],
        excludeSelectors: ['[data-editor-root]', '[data-modal]'],
        onClickOutside
      })

      return { containerRef }
    })

    editor.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(onClickOutside).not.toHaveBeenCalled()

    modal.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(onClickOutside).not.toHaveBeenCalled()

    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    expect(onClickOutside).toHaveBeenCalledTimes(1)
  })
})
