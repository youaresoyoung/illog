'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { DocMeta } from '@/lib/mdx'
import { Box, Stack, Text } from '@/app/components/common/UI'

type NavSection = {
  title: string
  items: DocMeta[]
}

type Props = {
  docs: DocMeta[]
}

const CATEGORY_LABELS: Record<string, string> = {
  Components: 'Components',
  Foundation: 'Foundation',
  Guidelines: 'Guidelines'
}

const CATEGORY_ORDER = ['Foundation', 'Components', 'Guidelines']

function groupByCategory(docs: DocMeta[]): NavSection[] {
  const grouped: Record<string, DocMeta[]> = {}
  for (const doc of docs) {
    const cat = doc.category || 'Uncategorized'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(doc)
  }
  return CATEGORY_ORDER.filter((cat) => grouped[cat]).map((cat) => ({
    title: CATEGORY_LABELS[cat] || cat,
    items: grouped[cat]
  }))
}

export function Sidebar({ docs }: Props) {
  const pathname = usePathname()
  const sections = groupByCategory(docs)

  return (
    <Box
      as="aside"
      borderRight="border"
      borderColor="borderDefaultDefault"
      borderRightStyle="solid"
      width={260}
      minWidth={260}
      height={'100vh'}
      position="sticky"
      top={0}
      overflowY="auto"
      style={{
        padding: '1.5rem 0'
      }}
    >
      <Box px="600" pb="400" mb="400" borderBottom="border" borderColor="borderDefaultSecondary">
        <Link href="/docs" style={{ textDecoration: 'none' }}>
          <Text
            as="span"
            textStyle="bodyStrong"
            color="textDefaultDefault"
            style={{ fontSize: '1.125rem' }}
          >
            Docs
          </Text>
        </Link>
      </Box>

      <Stack px="400" gap="600">
        {sections.map((section) => (
          <Stack key={section.title} gap="300">
            <Text
              as="h3"
              textStyle="captionStrong"
              color="textDefaultTertiary"
              px="200"
              style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              {section.title}
            </Text>

            <Stack gap="100">
              {section.items.map((item) => {
                const href = `/docs/${item.slug.join('/')}`
                const isActive = pathname === href

                return (
                  <Link
                    key={href}
                    href={href}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit'
                    }}
                  >
                    <Box
                      rounded="100"
                      px="200"
                      py="150"
                      bg={isActive ? 'backgroundDefaultSecondary' : undefined}
                      _hover={{ bg: 'backgroundDefaultDefaultHover' }}
                    >
                      <Text
                        as="span"
                        textStyle="bodySmall"
                        color={isActive ? 'textDefaultDefault' : 'textDefaultSecondary'}
                        style={isActive ? { fontWeight: 500 } : undefined}
                      >
                        {item.title}
                      </Text>
                    </Box>
                  </Link>
                )
              })}
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
