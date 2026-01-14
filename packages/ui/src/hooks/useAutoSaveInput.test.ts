import { renderHook, act } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useAutoSaveInput } from './useAutoSaveInput'
import { ChangeEvent } from 'react'

describe('useAutoSaveInput', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should return initial value', () => {
    const onSave = vi.fn()
    const { result } = renderHook(() => useAutoSaveInput('initial', onSave, 500))

    const [value] = result.current
    expect(value).toBe('initial')
  })

  it('should return setValue function', () => {
    const onSave = vi.fn()
    const { result } = renderHook(() => useAutoSaveInput('initial', onSave, 500))

    const [, setValue] = result.current
    expect(typeof setValue).toBe('function')
  })

  it('should return handleChange function', () => {
    const onSave = vi.fn()
    const { result } = renderHook(() => useAutoSaveInput('initial', onSave, 500))

    const [, , handleChange] = result.current
    expect(typeof handleChange).toBe('function')
  })

  it('should update value when setValue is called', () => {
    const onSave = vi.fn()
    const { result } = renderHook(() => useAutoSaveInput('initial', onSave, 500))

    act(() => {
      const [, setValue] = result.current
      setValue('updated')
    })

    const [value] = result.current
    expect(value).toBe('updated')
  })

  it('should update value when handleChange is called', () => {
    const onSave = vi.fn()
    const { result } = renderHook(() => useAutoSaveInput('initial', onSave, 500))

    const mockEvent = {
      target: { value: 'typed value' }
    } as ChangeEvent<HTMLInputElement>

    act(() => {
      const [, , handleChange] = result.current
      handleChange(mockEvent)
    })

    const [value] = result.current
    expect(value).toBe('typed value')
  })

  it('should call onSave after delay when value changes', () => {
    const onSave = vi.fn()
    const { result } = renderHook(() => useAutoSaveInput('initial', onSave, 500))

    act(() => {
      const [, setValue] = result.current
      setValue('updated')
    })

    expect(onSave).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith('updated')
  })

  it('should debounce rapid value changes', () => {
    const onSave = vi.fn()
    const { result } = renderHook(() => useAutoSaveInput('initial', onSave, 500))

    act(() => {
      const [, setValue] = result.current
      setValue('first')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    act(() => {
      const [, setValue] = result.current
      setValue('second')
    })

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(onSave).toHaveBeenCalledTimes(1)
    expect(onSave).toHaveBeenCalledWith('second')
  })

  it('should use default delay of 1000ms', () => {
    const onSave = vi.fn()
    const { result } = renderHook(() => useAutoSaveInput('initial', onSave))

    act(() => {
      const [, setValue] = result.current
      setValue('updated')
    })

    act(() => {
      vi.advanceTimersByTime(999)
    })

    expect(onSave).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })

    expect(onSave).toHaveBeenCalled()
  })

  it('should sync with initialValue changes', () => {
    const onSave = vi.fn()
    const { result, rerender } = renderHook(
      ({ initialValue }) => useAutoSaveInput(initialValue, onSave, 500),
      { initialProps: { initialValue: 'initial' } }
    )

    expect(result.current[0]).toBe('initial')

    rerender({ initialValue: 'external update' })

    expect(result.current[0]).toBe('external update')
  })

  it('should handle textarea events', () => {
    const onSave = vi.fn()
    const { result } = renderHook(() => useAutoSaveInput('initial', onSave, 500))

    const mockEvent = {
      target: { value: 'textarea content' }
    } as ChangeEvent<HTMLTextAreaElement>

    act(() => {
      const [, , handleChange] = result.current
      handleChange(mockEvent)
    })

    expect(result.current[0]).toBe('textarea content')
  })

  it('should maintain handleChange reference stability', () => {
    const onSave = vi.fn()
    const { result, rerender } = renderHook(() => useAutoSaveInput('initial', onSave, 500))

    const firstHandleChange = result.current[2]

    rerender()

    const secondHandleChange = result.current[2]

    expect(firstHandleChange).toBe(secondHandleChange)
  })

  it('should not call onSave on initial mount', () => {
    const onSave = vi.fn()
    renderHook(() => useAutoSaveInput('initial', onSave, 500))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(onSave).not.toHaveBeenCalled()
  })
})
