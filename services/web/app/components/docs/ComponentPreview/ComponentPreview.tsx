'use client'

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useRef,
  useState
} from 'react'
import { Box, Inline, Stack, Text } from '@/app/components/common/UI'

type Props = {
  children: ReactNode
  code?: string
}

function isPreElement(child: ReactNode): child is ReactElement {
  return (
    isValidElement(child) &&
    (child.type === 'pre' ||
      (child.props as Record<string, unknown>)?.['data-rehype-pretty-code-figure'] !== undefined)
  )
}

function extractTextFromElement(element: ReactNode): string {
  if (typeof element === 'string') return element
  if (typeof element === 'number') return String(element)
  if (!isValidElement(element)) return ''
  const children = (element.props as Record<string, unknown>)?.children
  if (!children) return ''
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(extractTextFromElement).join('')
  return extractTextFromElement(children as ReactNode)
}

export function ComponentPreview({ children, code }: Props) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLDivElement>(null)

  const previewChildren: ReactNode[] = []
  let codeBlock: ReactElement | null = null
  let codeString = code ?? ''

  Children.forEach(children, (child) => {
    if (!codeBlock && isPreElement(child)) {
      codeBlock = child as ReactElement
      if (!code) {
        codeString = extractTextFromElement(child)
      }
    } else {
      previewChildren.push(child)
    }
  })

  const hasCode = Boolean(codeString) || Boolean(codeBlock)

  const handleCopy = async () => {
    if (codeString) {
      await navigator.clipboard.writeText(codeString)
    } else if (codeRef.current) {
      await navigator.clipboard.writeText(codeRef.current.textContent ?? '')
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Stack
      gap="0"
      border="border"
      borderColor="borderDefaultSecondary"
      rounded="200"
      overflow="hidden"
      my="600"
    >
      {hasCode && (
        <Inline
          align="center"
          justify="space-between"
          px="200"
          borderBottom="border"
          borderColor="borderDefaultSecondary"
          bg="backgroundDefaultDefault"
        >
          <Inline gap="0">
            <Box
              as="button"
              type="button"
              px="300"
              py="300"
              onClick={() => setActiveTab('preview')}
              style={{
                border: 'none',
                cursor: 'pointer',
                background: 'transparent',
                color: activeTab === 'preview' ? '#1a1a1a' : '#999'
              }}
            >
              <Text as="span" textStyle="captionStrong">
                Preview
              </Text>
            </Box>
            <Box
              as="button"
              type="button"
              px="300"
              py="300"
              onClick={() => setActiveTab('code')}
              style={{
                border: 'none',
                cursor: 'pointer',
                background: 'transparent',
                color: activeTab === 'code' ? '#1a1a1a' : '#999'
              }}
            >
              <Text as="span" textStyle="captionStrong">
                Code
              </Text>
            </Box>
          </Inline>

          <Box
            as="button"
            type="button"
            onClick={handleCopy}
            px="300"
            py="200"
            rounded="100"
            _hover={{ bg: 'backgroundDefaultSecondary' }}
            style={{ border: 'none', cursor: 'pointer' }}
            aria-label="Copy code"
          >
            <Text
              as="span"
              textStyle="caption"
              color={copied ? 'textBrandDefault' : 'textDefaultSecondary'}
            >
              {copied ? 'Copied' : 'Copy'}
            </Text>
          </Box>
        </Inline>
      )}

      {activeTab === 'preview' ? (
        <Inline
          as="section"
          wrap="wrap"
          align="center"
          gap="300"
          p="1200"
          bg="backgroundDefaultSecondary"
        >
          {previewChildren}
        </Inline>
      ) : (
        <Box bg="backgroundDefaultDefault" style={{ background: '#1a1a1a' }} ref={codeRef}>
          {codeBlock ? (
            codeBlock
          ) : (
            <Box
              as="pre"
              p="600"
              style={{
                margin: 0,
                overflowX: 'auto',
                color: '#e5e5e5',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                fontSize: '14px',
                lineHeight: 1.6,
                whiteSpace: 'pre'
              }}
            >
              <Box as="code" style={{ color: 'inherit', background: 'none', padding: 0 }}>
                {codeString}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Stack>
  )
}
