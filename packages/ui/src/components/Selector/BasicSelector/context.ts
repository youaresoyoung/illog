import { createContext, useContext } from 'react'
import { BasicSelectorContextValue } from './types'

export const BasicSelectorContext = createContext<BasicSelectorContextValue | null>(null)

export const useBasicSelectorContext = () => {
  const context = useContext(BasicSelectorContext)
  if (!context) {
    throw new Error('useBasicSelectorContext must be used within a BasicSelectorProvider')
  }
  return context
}
