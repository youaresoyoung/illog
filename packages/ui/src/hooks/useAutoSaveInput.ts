import { ChangeEvent, Dispatch, SetStateAction, useCallback, useState, useEffect } from 'react'
import { useAutoSave } from './useAutoSave'

export const useAutoSaveInput = (
  initialValue: string,
  onSave: (value: string) => Promise<void> | void,
  delay: number = 1000
): [
  value: string,
  setValue: Dispatch<SetStateAction<string>>,
  handleChange: (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
] => {
  const [value, setValue] = useState<string>(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setValue(e.target.value)
  }, [])

  useAutoSave(value, onSave, delay)

  return [value, setValue, handleChange]
}
