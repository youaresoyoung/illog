import { createContext, ReactNode, useContext, useState } from 'react'
import { createToolbarStore, ToolbarStore, ToolbarStoreApi } from '../stores/useEditorStore'
import { useStore } from 'zustand'

const ToolbarStoreContext = createContext<ToolbarStoreApi | null>(null)

export const ToolbarStoreProvider = ({ children }: { children: ReactNode }) => {
  const [store] = useState(() => createToolbarStore())

  return <ToolbarStoreContext.Provider value={store}>{children}</ToolbarStoreContext.Provider>
}

export const useToolbarStore = <T,>(selector: (store: ToolbarStore) => T): T => {
  const store = useContext(ToolbarStoreContext)
  if (!store) {
    throw new Error('useToolbarStore must be used within ToolbarStoreProvider')
  }
  return useStore(store, selector)
}
