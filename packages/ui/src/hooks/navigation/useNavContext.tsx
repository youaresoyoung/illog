import { createContext, useContext, useMemo, useState } from 'react'
import { NavList } from './types'

export type NavContextValue = {
  navItems: Map<string, HTMLElement | null>
  activeId: string | null
  list: NavList
  updateActiveId: (id: string | null) => void
  registerNavItem: (id: string, ref: HTMLElement | null) => void
}

const NavContext = createContext<NavContextValue | null>(null)

type NavProviderProps = {
  children: React.ReactNode
  list?: NavList
  defaultActiveId?: string | null
}

export const NavProvider = ({ children, list = [], defaultActiveId = null }: NavProviderProps) => {
  const [activeId, setActiveId] = useState<string | null>(defaultActiveId)
  const [navItems, setNavItems] = useState<Map<string, HTMLElement | null>>(new Map())

  const updateActiveId = (id: string | null) => setActiveId(id)

  const registerNavItem = (id: string, ref: HTMLElement | null) => {
    setNavItems((prev) => {
      const next = new Map(prev)
      next.set(id, ref)
      return next
    })
  }

  const value = useMemo(
    () => ({
      navItems,
      activeId,
      list,
      updateActiveId,
      registerNavItem
    }),
    [navItems, activeId, list]
  )

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>
}

export const useNavContext = () => {
  const context = useContext(NavContext)
  if (!context) {
    throw new Error('useNavContext must be used within a NavProvider')
  }
  return context
}
