import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState } from 'react'
import { useAutoSave } from './useAutoSave'

export const useAutoSaveInput = <T>(
  initialValue: T,
  onSave: (value: T) => Promise<void> | void,
  delay: number = 1000
): [
  value: T,
  setValue: Dispatch<SetStateAction<T>>,
  handleChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
] => {
  const [value, setValue] = useState<T>(initialValue)

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(e.target.value as T)
  }, [])

  useAutoSave(value, onSave, delay)

  return [value, setValue, handleChange]
}
