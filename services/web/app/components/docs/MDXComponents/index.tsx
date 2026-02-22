import type { MDXComponents } from 'mdx/types'
import {
  Badge,
  Box,
  Button,
  Card,
  Center,
  Dialog,
  Divider,
  DonutChart,
  HorizontalBar,
  Icon,
  Inline,
  Input,
  Overlay,
  Stack,
  Tag,
  Text,
  ToastItem,
  ToggleMenu
} from './ClientComponents'
import { ComponentPreview } from '../ComponentPreview/ComponentPreview'
import { IconGallery } from '../IconGallery'
import { PropsTable } from '../PropsTable/PropsTable'
import { TokenReference } from '../TokenReference'
import { CodeBlock } from './CodeBlock'

const tableCellStyle = {
  padding: '0.75rem 1rem',
  borderBottom: '1px solid #f0f0f0',
  textAlign: 'left' as const,
  verticalAlign: 'top' as const
}

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <Text
      as="h1"
      textStyle="title"
      color="textDefaultDefault"
      style={{ fontSize: '2rem', lineHeight: 1.3, marginBottom: '0.5rem' }}
      {...props}
    />
  ),
  h2: (props) => (
    <Text
      as="h2"
      textStyle="subtitle"
      color="textDefaultDefault"
      style={{
        fontSize: '1.5rem',
        margin: '2.5rem 0 1rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid #e5e5e5'
      }}
      {...props}
    />
  ),
  h3: (props) => (
    <Text
      as="h3"
      textStyle="heading"
      color="textDefaultDefault"
      style={{ fontSize: '1.125rem', margin: '2rem 0 0.75rem' }}
      {...props}
    />
  ),
  p: (props) => (
    <Text
      as="p"
      textStyle="bodyBase"
      color="textDefaultSecondary"
      style={{ lineHeight: 1.75, marginBottom: '1rem' }}
      {...props}
    />
  ),
  a: (props) => (
    <Box
      as="a"
      {...props}
      _hover={{ color: 'textDefaultDefault' }}
      style={{
        color: 'var(--text-brand-default)',
        textDecoration: 'underline',
        textUnderlineOffset: '3px'
      }}
    />
  ),
  code: (props) => {
    const className = typeof props.className === 'string' ? props.className : ''
    const hasLanguageClass = className.split(' ').some((name) => name.startsWith('language-'))
    const isBlockCode =
      hasLanguageClass ||
      (props as Record<string, unknown>)['data-language'] !== undefined ||
      (props as Record<string, unknown>)['data-theme'] !== undefined

    return (
      <Box
        as="code"
        {...props}
        bg={isBlockCode ? undefined : 'backgroundDefaultSecondary'}
        px={isBlockCode ? undefined : '100'}
        py={isBlockCode ? undefined : '50'}
        rounded={isBlockCode ? undefined : '100'}
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: '0.875em',
          ...(isBlockCode ? { background: 'transparent', padding: 0 } : {}),
          ...(typeof props.style === 'object' && props.style !== null ? props.style : {})
        }}
      />
    )
  },
  pre: (props) => <CodeBlock {...props} />,
  table: (props) => (
    <Box overflow="auto" my="600">
      <Box
        as="table"
        style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}
        {...props}
      />
    </Box>
  ),
  thead: (props) => <Box as="thead" {...props} />,
  tbody: (props) => <Box as="tbody" {...props} />,
  tr: (props) => (
    <Box as="tr" {...props} _hover={{ backgroundColor: 'backgroundDefaultSecondary' }} />
  ),
  th: (props) => (
    <Box
      as="th"
      style={{
        ...tableCellStyle,
        borderBottom: '2px solid #e5e5e5',
        fontWeight: 600,
        color: '#1a1a1a',
        whiteSpace: 'nowrap'
      }}
      {...props}
    />
  ),
  td: (props) => <Box as="td" style={tableCellStyle} {...props} />,
  ul: (props) => (
    <Box
      as="ul"
      style={{ margin: '0 0 1rem', paddingLeft: '1.5rem', color: '#404040' }}
      {...props}
    />
  ),
  ol: (props) => (
    <Box
      as="ol"
      style={{ margin: '0 0 1rem', paddingLeft: '1.5rem', color: '#404040' }}
      {...props}
    />
  ),
  li: (props) => <Box as="li" style={{ margin: '0.25rem 0', lineHeight: 1.75 }} {...props} />,
  hr: () => <Divider />,
  blockquote: (props) => (
    <Box
      as="blockquote"
      borderLeft="border"
      borderColor="borderDefaultSecondary"
      pl="600"
      py="200"
      my="600"
      style={{ color: '#737373' }}
      {...props}
    />
  ),
  ComponentPreview,
  PropsTable,
  TokenReference,
  IconGallery,
  Button,
  Text,
  Icon,
  Box,
  Stack,
  Inline,
  Center,
  Card,
  Input,
  Badge,
  Tag,
  Divider,
  Dialog,
  Overlay,
  DonutChart,
  HorizontalBar,
  ToggleMenu,
  ToastItem
}
