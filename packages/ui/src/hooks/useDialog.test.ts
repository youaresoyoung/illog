import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect } from 'vitest'
import { useDialog } from './useDialog'

describe('useDialog', () => {
  it('should return isOpen as false by default', () => {
    const { result } = renderHook(() => useDialog({}))

    const [isOpen] = result.current
    expect(isOpen).toBe(false)
  })

  it('should return isOpen as true when initialOpen is true', () => {
    const { result } = renderHook(() => useDialog({ initialOpen: true }))

    const [isOpen] = result.current
    expect(isOpen).toBe(true)
  })

  it('should return open function', () => {
    const { result } = renderHook(() => useDialog({}))

    const [, open] = result.current
    expect(typeof open).toBe('function')
  })

  it('should return close function', () => {
    const { result } = renderHook(() => useDialog({}))

    const [, , close] = result.current
    expect(typeof close).toBe('function')
  })

  it('should set isOpen to true when open is called', () => {
    const { result } = renderHook(() => useDialog({}))

    act(() => {
      const [, open] = result.current
      open()
    })

    const [isOpen] = result.current
    expect(isOpen).toBe(true)
  })

  it('should set isOpen to false when close is called', () => {
    const { result } = renderHook(() => useDialog({ initialOpen: true }))

    act(() => {
      const [, , close] = result.current
      close()
    })

    const [isOpen] = result.current
    expect(isOpen).toBe(false)
  })

  it('should call onOpen callback when open is called', () => {
    const onOpen = vi.fn()
    const { result } = renderHook(() => useDialog({ onOpen }))

    act(() => {
      const [, open] = result.current
      open()
    })

    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('should call onClose callback when close is called', () => {
    const onClose = vi.fn()
    const { result } = renderHook(() => useDialog({ initialOpen: true, onClose }))

    act(() => {
      const [, , close] = result.current
      close()
    })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should not call onOpen when it is not provided', () => {
    const { result } = renderHook(() => useDialog({}))

    expect(() => {
      act(() => {
        const [, open] = result.current
        open()
      })
    }).not.toThrow()
  })

  it('should not call onClose when it is not provided', () => {
    const { result } = renderHook(() => useDialog({ initialOpen: true }))

    expect(() => {
      act(() => {
        const [, , close] = result.current
        close()
      })
    }).not.toThrow()
  })

  it('should maintain function reference stability', () => {
    const { result, rerender } = renderHook(() => useDialog({}))

    const [, firstOpen, firstClose] = result.current

    rerender()

    const [, secondOpen, secondClose] = result.current

    expect(firstOpen).toBe(secondOpen)
    expect(firstClose).toBe(secondClose)
  })

  it('should toggle isOpen correctly with open and close', () => {
    const { result } = renderHook(() => useDialog({}))

    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(true)

    act(() => {
      result.current[2]()
    })

    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1]()
    })

    expect(result.current[0]).toBe(true)
  })

  it('should work with all callbacks provided', () => {
    const onOpen = vi.fn()
    const onClose = vi.fn()

    const { result } = renderHook(() => useDialog({ initialOpen: false, onOpen, onClose }))

    act(() => {
      result.current[1]()
    })

    expect(onOpen).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()

    act(() => {
      result.current[2]()
    })

    expect(onOpen).toHaveBeenCalledTimes(1)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
