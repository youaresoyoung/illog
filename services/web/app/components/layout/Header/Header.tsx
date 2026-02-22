'use client'

import Image from 'next/image'
import logo from '@/app/assets/images/logo@x2.png'
import { HEADER_NAV_CLICKED } from '@illog/analytics'
import { useUmami } from '@/app/hooks/useUmami'
import { Box, Button, Inline } from '@/app/components/common/UI'
import Link from 'next/link'

export function Header() {
  const { track } = useUmami()

  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      z={100}
      borderBottom="border"
      borderColor="borderDefaultSecondary"
      style={{ backdropFilter: 'blur(12px)', background: 'rgba(255, 255, 255, 0.85)' }}
    >
      <Inline
        align="center"
        justify="space-between"
        h="64px"
        px="600"
        width={'100%'}
        maxWidth={1200}
        style={{ margin: '0 auto' }}
      >
        <Image width={120} src={logo} alt="Illog Logo" />
        <Inline gap="300" align="center">
          <Button variant="secondary" onClick={() => track(HEADER_NAV_CLICKED, { target: 'docs' })}>
            <Link href="/docs">Developer Docs</Link>
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              track(HEADER_NAV_CLICKED, { target: 'download' })
              document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Download
          </Button>
        </Inline>
      </Inline>
    </Box>
  )
}
