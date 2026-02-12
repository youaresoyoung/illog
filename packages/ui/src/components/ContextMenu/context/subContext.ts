import { createContext, useContext } from 'react'
import { ContextMenuSubContextValue } from '../types'

export const ContextMenuSubContext = createContext<ContextMenuSubContextValue | null>(null)

export const useContextMenuSubContext = () => {
  const context = useContext(ContextMenuSubContext)
  if (!context) {
    throw new Error('useContextMenuSubContext must be used within a ContextMenuSubProvider')
  }
  return context
}
