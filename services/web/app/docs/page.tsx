import Link from 'next/link'
import { getAllDocs } from '@/lib/mdx'
import { Box, Stack, Text } from '@/app/components/common/UI'

const CATEGORY_ORDER = ['Foundation', 'Components', 'Guidelines']

export default function DocsPage() {
  const docs = getAllDocs()

  const grouped: Record<string, typeof docs> = {}
  for (const doc of docs) {
    const cat = doc.category || 'Uncategorized'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(doc)
  }

  const categories = CATEGORY_ORDER.filter((cat) => grouped[cat])

  return (
    <Stack gap="1200">
      <Stack gap="300">
        <Text as="h1" textStyle="title" color="textDefaultDefault" style={{ fontSize: '2rem' }}>
          illog Design System
        </Text>
        <Text as="p" textStyle="bodyBase" color="textDefaultSecondary" style={{ lineHeight: 1.6 }}>
          UI components, design tokens, and guidelines for building illog.
        </Text>
      </Stack>

      {categories.map((cat) => (
        <Stack as="section" key={cat} gap="400">
          <Text
            as="h2"
            textStyle="captionStrong"
            color="textDefaultTertiary"
            style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            {cat}
          </Text>

          <Box
            display="grid"
            gap="400"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}
          >
            {grouped[cat].map((doc) => (
              <Link key={doc.slug.join('/')} href={`/docs/${doc.slug.join('/')}`}>
                <Stack
                  gap="200"
                  p="600"
                  border="border"
                  borderColor="borderDefaultSecondary"
                  rounded="200"
                  _hover={{ borderColor: 'borderDefaultDefault', bg: 'backgroundDefaultSecondary' }}
                  style={{ transition: 'all 0.15s ease', minHeight: '100%' }}
                >
                  <Text as="h3" textStyle="bodyStrong" color="textDefaultDefault">
                    {doc.title}
                  </Text>
                  <Text as="p" textStyle="bodySmall" color="textDefaultSecondary" lineHeight="1.5">
                    {doc.description}
                  </Text>
                </Stack>
              </Link>
            ))}
          </Box>
        </Stack>
      ))}
    </Stack>
  )
}
