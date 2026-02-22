'use client'

import { useState } from 'react'
import type { IconName } from '@illog/ui'
import { IconNameOptions } from '@illog/ui'
import { Box, Icon, Input, Stack, Text } from '@/app/components/common/UI'

export function IconGallery() {
  const [filter, setFilter] = useState('')
  const [copiedName, setCopiedName] = useState<string | null>(null)

  const filtered = filter
    ? IconNameOptions.filter((name) => name.toLowerCase().includes(filter.toLowerCase()))
    : IconNameOptions

  const handleCopy = async (name: IconName) => {
    await navigator.clipboard.writeText(`<Icon name="${name}" />`)
    setCopiedName(name)
    setTimeout(() => setCopiedName(null), 1500)
  }

  return (
    <Stack gap="400" my="600">
      <Box display="flex" align="center" style={{ gap: '0.75rem' }}>
        <Box style={{ flex: 1 }}>
          <Input
            type="text"
            placeholder="Search Icon..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </Box>
        <Text
          as="span"
          textStyle="caption"
          color="textDefaultTertiary"
          style={{ whiteSpace: 'nowrap' }}
        >
          {filtered.length} icons
        </Text>
      </Box>

      <Box
        display="grid"
        gap="200"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}
      >
        {filtered.map((name) => (
          <Box
            as="button"
            key={name}
            type="button"
            onClick={() => handleCopy(name)}
            title={`<Icon name="${name}" /> 복사`}
            border="border"
            borderColor="borderDefaultSecondary"
            rounded="200"
            p="400"
            _hover={{ bg: 'backgroundDefaultSecondary' }}
            _active={{ bg: 'backgroundDefaultTertiary' }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <Box
              display="flex"
              align="center"
              justify="center"
              style={{ width: '40px', height: '40px' }}
            >
              <Icon name={name} size="large" />
            </Box>
            <Text
              as="span"
              textStyle="caption"
              color={copiedName === name ? 'textBrandDefault' : 'textDefaultSecondary'}
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                textAlign: 'center',
                wordBreak: 'break-all',
                lineHeight: 1.3
              }}
            >
              {copiedName === name ? 'Copied!' : name}
            </Text>
          </Box>
        ))}
      </Box>

      {filtered.length === 0 && (
        <Text as="p" textStyle="bodySmall" color="textDefaultTertiary" align="center" py="1200">
          There&apos;s no icon matching your search.
        </Text>
      )}
    </Stack>
  )
}
