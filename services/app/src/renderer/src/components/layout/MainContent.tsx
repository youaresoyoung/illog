import { Inline, Stack } from '@illog/ui'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const MainContent = ({ children }: Props) => {
  return (
    <Inline
      as="main"
      w="100%"
      pt="1200"
      pb="2400"
      style={{
        marginLeft: '256px'
      }}
    >
      <Stack
        minWidth={592}
        style={{
          margin: '0 auto'
        }}
      >
        {children}
      </Stack>
    </Inline>
  )
}
