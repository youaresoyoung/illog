import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { getDocBySlug, getDocSlugs } from '@/lib/mdx'
import { Box, Stack, Text } from '@/app/components/common/UI'
import { mdxComponents } from '@/app/components/docs/MDXComponents'

type Props = {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  return getDocSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  try {
    const { meta } = getDocBySlug(slug)
    return {
      title: meta.title,
      description: meta.description
    }
  } catch {
    return { title: 'Not Found' }
  }
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params

  let doc
  try {
    doc = getDocBySlug(slug)
  } catch {
    notFound()
  }

  return (
    <Stack as="article" gap="1200" pb="2400">
      <Stack as="header" gap="300">
        <Text
          as="p"
          textStyle="captionStrong"
          color="textDefaultTertiary"
          style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          {doc.meta.category}
        </Text>
        <Text
          as="h1"
          textStyle="title"
          color="textDefaultDefault"
          style={{ fontSize: '2rem', lineHeight: 1.3 }}
        >
          {doc.meta.title}
        </Text>
        <Text as="p" textStyle="bodyBase" color="textDefaultSecondary" style={{ lineHeight: 1.6 }}>
          {doc.meta.description}
        </Text>
      </Stack>

      <Box>
        <MDXRemote
          source={doc.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: 'github-dark' }]]
            }
          }}
        />
      </Box>
    </Stack>
  )
}
