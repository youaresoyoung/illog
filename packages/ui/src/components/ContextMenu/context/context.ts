import { createContext, useContext } from 'react'
import { ContextMenuContextValue } from '../types'

export const ContextMenuContext = createContext<ContextMenuContextValue | null>(null)

export const useContextMenuContext = () => {
  const context = useContext(ContextMenuContext)
  if (!context) {
    throw new Error('useContextMenuContext must be used within a ContextMenuProvider')
  }
  return context
}
