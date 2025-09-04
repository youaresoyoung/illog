import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const MainContent = ({ children }: Props) => {
  return (
    <main
      style={{
        minWidth: 592,
        marginLeft: '256px',
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto'
      }}
    >
      {children}
    </main>
  )
}
