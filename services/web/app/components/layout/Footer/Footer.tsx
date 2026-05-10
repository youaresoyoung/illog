'use client'

import Link from 'next/link'
import { FOOTER_LINK_CLICKED } from '@illog/analytics'
import { useUmami } from '@/app/hooks/useUmami'
import { Box, Inline, Text } from '@/app/components/common/UI'

export function Footer() {
  const { track } = useUmami()

  return (
    <Box as="footer" px="600" py="1200" borderTop="border" borderColor="borderDefaultSecondary">
      <Inline
        justify="space-between"
        align="center"
        wrap="wrap"
        gap="600"
        width={'100%'}
        maxWidth={1200}
        style={{ margin: '0 auto' }}
      >
        <Text as="span" textStyle="bodyStrong" color="textDefaultDefault">
          illog
        </Text>

        <Inline align="center" gap="600" wrap="wrap">
          <Link
            href="/privacy"
            onClick={() => track(FOOTER_LINK_CLICKED, { target: 'privacy' })}
            style={{ textDecoration: 'none' }}
          >
            <Box
              _hover={{ color: 'textDefaultDefault' }}
              style={{ color: 'var(--text-default-secondary)' }}
            >
              <Text as="span" textStyle="caption">
                Privacy Policy
              </Text>
            </Box>
          </Link>
          <Text as="span" textStyle="caption" color="textDefaultTertiary">
            © {new Date().getFullYear()} illog. All rights reserved.
          </Text>
        </Inline>
      </Inline>
    </Box>
  )
}
