'use client'

import { useState } from 'react'
import { Box, Input, Inline, Stack, Text } from '@/app/components/common/UI'

export type TokenItem = {
  path: string
  value: string
  rawValue: string
  isColor: boolean
}

interface TokenTableProps {
  items: TokenItem[]
}

const headerCellStyle = {
  padding: '0.625rem 1rem',
  textAlign: 'left' as const,
  borderBottom: '1px solid #e5e5e5',
  background: '#fafafa'
}

const bodyCellStyle = {
  padding: '0.5rem 1rem',
  borderBottom: '1px solid #f5f5f5',
  verticalAlign: 'middle' as const
}

export function TokenTable({ items }: TokenTableProps) {
  const [filter, setFilter] = useState('')
  const [copiedPath, setCopiedPath] = useState<string | null>(null)

  const filtered = filter
    ? items.filter(
        (item) =>
          item.path.toLowerCase().includes(filter.toLowerCase()) ||
          item.value.toLowerCase().includes(filter.toLowerCase())
      )
    : items

  const showPreview = filtered.some((i) => i.isColor)

  const handleCopy = async (text: string, path: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedPath(path)
    setTimeout(() => setCopiedPath(null), 1500)
  }

  return (
    <Stack gap="400" my="600">
      <Inline align="center" gap="300">
        <Box style={{ flex: 1 }}>
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search tokens..."
          />
        </Box>
        <Text
          as="span"
          textStyle="caption"
          color="textDefaultTertiary"
          style={{ whiteSpace: 'nowrap' }}
        >
          {filtered.length} tokens
        </Text>
      </Inline>

      <Box overflow="auto" border="border" borderColor="borderDefaultSecondary" rounded="200">
        <Box
          as="table"
          style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}
        >
          <Box as="thead">
            <Box as="tr">
              <Box as="th" style={headerCellStyle}>
                <Text
                  as="span"
                  textStyle="captionStrong"
                  color="textDefaultSecondary"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  Token
                </Text>
              </Box>
              <Box as="th" style={headerCellStyle}>
                <Text
                  as="span"
                  textStyle="captionStrong"
                  color="textDefaultSecondary"
                  style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  Value
                </Text>
              </Box>
              {showPreview && (
                <Box as="th" style={headerCellStyle}>
                  <Text
                    as="span"
                    textStyle="captionStrong"
                    color="textDefaultSecondary"
                    style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                  >
                    Preview
                  </Text>
                </Box>
              )}
            </Box>
          </Box>

          <Box as="tbody">
            {filtered.map((item) => (
              <Box as="tr" key={item.path}>
                <Box as="td" style={bodyCellStyle}>
                  <Inline align="center" gap="200">
                    <Box
                      as="button"
                      type="button"
                      onClick={() => handleCopy(item.path, item.path)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        padding: 0,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Box
                        as="code"
                        style={{
                          fontSize: '0.8125rem',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                          color: '#1a1a1a'
                        }}
                      >
                        {item.path}
                      </Box>
                    </Box>
                    {copiedPath === item.path && (
                      <Text as="span" textStyle="caption" color="textBrandDefault">
                        Copied!
                      </Text>
                    )}
                  </Inline>
                </Box>

                <Box as="td" style={bodyCellStyle}>
                  <Inline align="center" gap="200">
                    <Box
                      as="button"
                      type="button"
                      onClick={() => handleCopy(item.rawValue, `val-${item.path}`)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        padding: 0,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Box
                        as="code"
                        style={{
                          fontSize: '0.8125rem',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                          color: '#525252'
                        }}
                      >
                        {item.value}
                      </Box>
                    </Box>
                    {copiedPath === `val-${item.path}` && (
                      <Text as="span" textStyle="caption" color="textBrandDefault">
                        Copied!
                      </Text>
                    )}
                  </Inline>
                </Box>

                {showPreview && (
                  <Box as="td" style={bodyCellStyle}>
                    {item.isColor && (
                      <Box
                        rounded="100"
                        border="border"
                        borderColor="borderDefaultSecondary"
                        style={{ width: '24px', height: '24px', background: item.rawValue }}
                      />
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Stack>
  )
}
