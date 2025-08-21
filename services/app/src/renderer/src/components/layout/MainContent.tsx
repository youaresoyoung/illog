import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const MainContent = ({ children }: Props) => {
  return <main style={{ marginLeft: '256px', padding: '12px' }}>{children}</main>
}
