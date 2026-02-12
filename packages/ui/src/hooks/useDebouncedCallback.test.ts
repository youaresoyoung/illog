import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useDebouncedCallback } from './useDebouncedCallback'

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return a function', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 500))

    expect(typeof result.current).toBe('function')
  })

  it('should debounce callback execution', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 500))

    act(() => {
      result.current('arg1')
    })

    expect(callback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('arg1')
  })

  it('should reset timer on rapid calls', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 500))

    act(() => {
      result.current('first')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    act(() => {
      result.current('second')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(callback).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('second')
  })

  it('should pass all arguments to the callback', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 500))

    act(() => {
      result.current('arg1', 'arg2', 'arg3')
    })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(callback).toHaveBeenCalledWith('arg1', 'arg2', 'arg3')
  })

  it('should use latest callback reference', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()

    const { result, rerender } = renderHook(({ callback }) => useDebouncedCallback(callback, 500), {
      initialProps: { callback: callback1 }
    })

    act(() => {
      result.current('test')
    })

    rerender({ callback: callback2 })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(callback1).not.toHaveBeenCalled()
    expect(callback2).toHaveBeenCalledWith('test')
  })

  it('should maintain same function reference when delay does not change', () => {
    const callback = vi.fn()
    const { result, rerender } = renderHook(() => useDebouncedCallback(callback, 500))

    const firstRef = result.current

    rerender()

    expect(result.current).toBe(firstRef)
  })

  it('should cleanup timer on unmount', () => {
    const callback = vi.fn()
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')

    const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 500))

    act(() => {
      result.current('test')
    })

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(callback).not.toHaveBeenCalled()

    clearTimeoutSpy.mockRestore()
  })

  it('should handle zero delay', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 0))

    act(() => {
      result.current('immediate')
    })

    act(() => {
      vi.advanceTimersByTime(0)
    })

    expect(callback).toHaveBeenCalledWith('immediate')
  })

  it('should work with async callbacks', async () => {
    const asyncCallback = vi.fn().mockResolvedValue('result')
    const { result } = renderHook(() => useDebouncedCallback(asyncCallback, 500))

    act(() => {
      result.current('async arg')
    })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(asyncCallback).toHaveBeenCalledWith('async arg')
  })
})
