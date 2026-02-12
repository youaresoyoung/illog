import { useEffect, useRef } from 'react'
import { useDebouncedCallback } from './useDebouncedCallback'

export const useAutoSave = <T>(
  value: T,
  onSave: (value: T) => Promise<void> | void,
  delay: number = 1000
) => {
  const isInitialMount = useRef(true)

  const debouncedSave = useDebouncedCallback(async (valueToSave: T) => {
    try {
      await onSave(valueToSave)
    } catch (error) {
      console.error('Auto save error:', error)
    }
  }, delay)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    debouncedSave(value)
  }, [value, debouncedSave])
}
