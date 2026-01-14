import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))

    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 }
    })

    expect(result.current).toBe('initial')

    rerender({ value: 'updated', delay: 500 })

    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })

  it('should reset timer on rapid value changes', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 }
    })

    rerender({ value: 'first', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    rerender({ value: 'second', delay: 500 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(200)
    })

    expect(result.current).toBe('second')
  })

  it('should handle different delay values', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 1000 }
    })

    rerender({ value: 'updated', delay: 1000 })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('initial')

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(result.current).toBe('updated')
  })

  it('should work with number values', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 0, delay: 300 }
    })

    expect(result.current).toBe(0)

    rerender({ value: 42, delay: 300 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe(42)
  })

  it('should work with object values', () => {
    const initialObj = { name: 'initial' }
    const updatedObj = { name: 'updated' }

    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: initialObj, delay: 300 }
    })

    expect(result.current).toBe(initialObj)

    rerender({ value: updatedObj, delay: 300 })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current).toBe(updatedObj)
  })

  it('should cleanup timer on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')

    const { unmount, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 500 }
    })

    rerender({ value: 'updated', delay: 500 })

    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })

  it('should handle zero delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 0 }
    })

    rerender({ value: 'updated', delay: 0 })

    act(() => {
      vi.advanceTimersByTime(0)
    })

    expect(result.current).toBe('updated')
  })
})
