import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useAutoSave } from './useAutoSave'

describe('useAutoSave', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should not call onSave on initial mount', () => {
    const onSave = vi.fn()

    renderHook(() => useAutoSave('initial', onSave, 500))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onSave).not.toHaveBeenCalled()
  })

  it('should call onSave when value changes after delay', () => {
    const onSave = vi.fn()

    const { rerender } = renderHook(({ value }) => useAutoSave(value, onSave, 500), {
      initialProps: { value: 'initial' }
    })

    rerender({ value: 'updated' })

    expect(onSave).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith('updated')
  })

  it('should debounce multiple rapid value changes', () => {
    const onSave = vi.fn()

    const { rerender } = renderHook(({ value }) => useAutoSave(value, onSave, 500), {
      initialProps: { value: 'initial' }
    })

    rerender({ value: 'first' })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    rerender({ value: 'second' })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    rerender({ value: 'third' })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith('third')
  })

  it('should use default delay of 1000ms', () => {
    const onSave = vi.fn()

    const { rerender } = renderHook(({ value }) => useAutoSave(value, onSave), {
      initialProps: { value: 'initial' }
    })

    rerender({ value: 'updated' })

    act(() => {
      vi.advanceTimersByTime(999)
    })

    expect(onSave).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(onSave).toHaveBeenCalledWith('updated')
  })

  it('should handle async onSave callback', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)

    const { rerender } = renderHook(({ value }) => useAutoSave(value, onSave, 500), {
      initialProps: { value: 'initial' }
    })

    rerender({ value: 'updated' })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onSave).toHaveBeenCalledWith('updated')
  })

  it('should log error when onSave throws', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const error = new Error('Save failed')
    const onSave = vi.fn().mockRejectedValue(error)

    const { rerender } = renderHook(({ value }) => useAutoSave(value, onSave, 500), {
      initialProps: { value: 'initial' }
    })

    rerender({ value: 'updated' })

    await act(async () => {
      vi.advanceTimersByTime(500)

      await vi.runAllTimersAsync()
    })

    expect(onSave).toHaveBeenCalled()
    expect(consoleSpy).toHaveBeenCalledWith('Auto save error:', error)
  })

  it('should work with object values', () => {
    const onSave = vi.fn()

    const { rerender } = renderHook(({ value }) => useAutoSave(value, onSave, 500), {
      initialProps: { value: { name: 'initial' } }
    })

    const newValue = { name: 'updated' }
    rerender({ value: newValue })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onSave).toHaveBeenCalledWith(newValue)
  })

  it('should work with number values', () => {
    const onSave = vi.fn()

    const { rerender } = renderHook(({ value }) => useAutoSave(value, onSave, 500), {
      initialProps: { value: 0 }
    })

    rerender({ value: 42 })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onSave).toHaveBeenCalledWith(42)
  })
})
