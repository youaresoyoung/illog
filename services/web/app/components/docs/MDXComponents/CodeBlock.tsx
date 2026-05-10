'use client'

import { type CSSProperties, type ReactNode, useRef, useState } from 'react'
import { Box, Text } from '@/app/components/common/UI'

type Props = {
  children: ReactNode
  style?: CSSProperties
  [key: string]: unknown
}

export function CodeBlock({ children, style, ...props }: Props) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)
  const incomingStyle = style ?? {}

  const handleCopy = async () => {
    const text = preRef.current?.textContent ?? ''
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Box position="relative" my="600">
      <Box
        as="pre"
        ref={preRef}
        p="600"
        rounded="200"
        overflow="auto"
        {...props}
        style={{
          ...incomingStyle,
          margin: 0,
          background: '#000000',
          color: '#e5e5e5',
          fontSize: '0.875rem',
          lineHeight: 1.6
        }}
      >
        {children}
      </Box>

      <Box
        as="button"
        type="button"
        onClick={handleCopy}
        px="300"
        py="200"
        rounded="100"
        style={{
          position: 'absolute',
          top: '0.625rem',
          right: '0.625rem',
          border: 'none',
          cursor: 'pointer',
          background: 'rgba(255, 255, 255, 0.12)'
        }}
        _hover={{ opacity: 0.92 }}
        aria-label="Copy code"
      >
        <Text as="span" textStyle="caption" style={{ color: '#e5e5e5' }}>
          {copied ? 'Copied' : 'Copy'}
        </Text>
      </Box>
    </Box>
  )
}
