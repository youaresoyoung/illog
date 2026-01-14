import { createContext, useContext } from 'react'

export type NavigationContextValue = {
  value: string
  onValueChange: (value: string) => void
}

const NavigationContext = createContext<NavigationContextValue | null>(null)

export const NavigationProvider = NavigationContext.Provider

export const useNavigationContext = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('Navigation.Item must be used within Navigation.Root')
  }
  return context
}
