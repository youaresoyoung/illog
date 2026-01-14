import { useCallback, useMemo, useState } from 'react'
import { NavigationProvider } from '../../context/navigation/NavContext'
import { RootProps } from './types'

/**
 * Navigation Root Component
 *
 * Supports both controlled and uncontrolled modes:
 *
 * @example Uncontrolled
 * ```tsx
 * <Navigation.Root defaultValue="today">
 *   <Navigation.List>
 *     <Navigation.Item value="today" to="/">Today</Navigation.Item>
 *   </Navigation.List>
 * </Navigation.Root>
 * ```
 *
 * @example Controlled
 * ```tsx
 * const [active, setActive] = useState('today')
 * <Navigation.Root value={active} onValueChange={setActive}>
 *   <Navigation.List>
 *     <Navigation.Item value="today" to="/">Today</Navigation.Item>
 *   </Navigation.List>
 * </Navigation.Root>
 * ```
 */
export const Root = <T extends string = string>({
  children,
  value: controlledValue,
  onValueChange,
  defaultValue = '' as T
}: RootProps<T>) => {
  const [uncontrolledValue, setUncontrolledValue] = useState<T>(defaultValue)

  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : uncontrolledValue

  const handleValueChange = useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setUncontrolledValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange]
  )

  const contextValue = useMemo(
    () => ({
      value,
      onValueChange: (v: string) => handleValueChange(v as T)
    }),
    [value, handleValueChange]
  )

  return <NavigationProvider value={contextValue}>{children}</NavigationProvider>
}
