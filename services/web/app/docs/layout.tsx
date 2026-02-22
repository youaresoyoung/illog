import type { Metadata } from 'next'
import { getAllDocs } from '@/lib/mdx'
import { Inline, Stack } from '@/app/components/common/UI'
import { Sidebar } from '../components/docs/Sidebar/Sidebar'

export const metadata: Metadata = {
  title: {
    template: '%s - illog Design System',
    default: 'illog Design System'
  },
  description: 'Design system documentation for illog UI components, tokens, and guidelines.'
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const docs = getAllDocs()

  return (
    <Inline minHeight="100vh">
      <Sidebar docs={docs} />
      <Stack
        as="main"
        maxWidth={'48rem'}
        margin="0 auto"
        style={{
          flex: 1,
          maxWidth: '48rem',
          margin: '0 auto',
          padding: '2.5rem 2rem'
        }}
      >
        {children}
      </Stack>
    </Inline>
  )
}
