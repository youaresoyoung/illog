import { createContext, useContext } from 'react'
import { MatchStrategy } from '../../components/Navigation/types'

export type NavigationListContextValue = {
  match: MatchStrategy
}

const NavigationListContext = createContext<NavigationListContextValue>({ match: 'exact' })

export const NavigationListProvider = NavigationListContext.Provider

export const useNavigationListContext = () => {
  return useContext(NavigationListContext)
}
