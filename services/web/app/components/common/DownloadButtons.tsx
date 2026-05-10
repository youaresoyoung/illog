'use client'

import { usePlatform } from '@/app/hooks/usePlatform'
import { useUmami } from '@/app/hooks/useUmami'
import { DOWNLOAD_CLICKED } from '@illog/analytics'
import { Box, Button, Inline } from '@/app/components/common/UI'
import { MobileNotice } from './MobileNotice'

const DOWNLOAD_LINKS = {
  'mac-arm': { label: 'Download for Mac (Apple Silicon)', href: '/api/download/mac-arm' },
  'mac-intel': { label: 'Download for Mac (Intel)', href: '/api/download/mac-intel' },
  windows: { label: 'Windows (Coming Soon)', href: '#download', disabled: true }
} as const

type Props = {
  size?: 'md' | 'lg'
  isShowAll?: boolean
}

function DownloadButton({
  href,
  label,
  size,
  onClick,
  variant,
  isDisabled = false
}: {
  href: string
  label: string
  size: 'md' | 'lg'
  onClick?: () => void
  variant: 'primary' | 'secondary'
  isDisabled?: boolean
}) {
  return (
    <Button
      variant={variant}
      size={size}
      isDisabled={isDisabled}
      onClick={() => {
        if (isDisabled) return
        onClick?.()
        window.location.assign(href)
      }}
    >
      {label}
    </Button>
  )
}

export function DownloadButtons({ size = 'md', isShowAll = false }: Props) {
  const { platform, isMobile } = usePlatform()
  const { track } = useUmami()

  const handleDownloadClick = (downloadPlatform: string) => {
    track(DOWNLOAD_CLICKED, { platform: downloadPlatform })
  }

  if (platform === null) {
    return (
      <Inline align="center" justify="center" style={{ minHeight: '48px', width: '100%' }}>
        <Box
          rounded="400"
          bg="backgroundDefaultTertiary"
          style={{ width: '280px', height: '46px', opacity: 0.85 }}
        />
      </Inline>
    )
  }

  if (isMobile) return <MobileNotice />

  if (isShowAll) {
    return (
      <Inline align="center" justify="center" wrap="wrap" gap="300" style={{ minHeight: '48px' }}>
        <DownloadButton
          href={DOWNLOAD_LINKS['mac-arm'].href}
          label={DOWNLOAD_LINKS['mac-arm'].label}
          size={size}
          variant="primary"
          onClick={() => handleDownloadClick('mac-arm')}
        />
        <DownloadButton
          href={DOWNLOAD_LINKS['mac-intel'].href}
          label={DOWNLOAD_LINKS['mac-intel'].label}
          size={size}
          variant="primary"
          onClick={() => handleDownloadClick('mac-intel')}
        />
        <DownloadButton
          href={DOWNLOAD_LINKS.windows.href}
          label={DOWNLOAD_LINKS.windows.label}
          size={size}
          variant="secondary"
          isDisabled
        />
      </Inline>
    )
  }

  if (platform === 'windows') {
    return (
      <Inline align="center" justify="center" wrap="wrap" gap="300" style={{ minHeight: '48px' }}>
        <DownloadButton
          href={DOWNLOAD_LINKS.windows.href}
          label={DOWNLOAD_LINKS.windows.label}
          size={size}
          variant="secondary"
          isDisabled
        />
      </Inline>
    )
  }

  if (platform === 'mac-arm') {
    return (
      <Inline align="center" justify="center" wrap="wrap" gap="300" style={{ minHeight: '48px' }}>
        <DownloadButton
          href={DOWNLOAD_LINKS['mac-arm'].href}
          label={DOWNLOAD_LINKS['mac-arm'].label}
          size={size}
          variant="primary"
          onClick={() => handleDownloadClick('mac-arm')}
        />
      </Inline>
    )
  }

  if (platform === 'mac-intel') {
    return (
      <Inline align="center" justify="center" wrap="wrap" gap="300" style={{ minHeight: '48px' }}>
        <DownloadButton
          href={DOWNLOAD_LINKS['mac-intel'].href}
          label={DOWNLOAD_LINKS['mac-intel'].label}
          size={size}
          variant="primary"
          onClick={() => handleDownloadClick('mac-intel')}
        />
      </Inline>
    )
  }

  if (platform === 'mac') {
    return (
      <Inline align="center" justify="center" wrap="wrap" gap="300" style={{ minHeight: '48px' }}>
        <DownloadButton
          href={DOWNLOAD_LINKS['mac-arm'].href}
          label={DOWNLOAD_LINKS['mac-arm'].label}
          size={size}
          variant="primary"
          onClick={() => handleDownloadClick('mac-arm')}
        />
        <DownloadButton
          href={DOWNLOAD_LINKS['mac-intel'].href}
          label={DOWNLOAD_LINKS['mac-intel'].label}
          size={size}
          variant="secondary"
        />
      </Inline>
    )
  }

  return (
    <Inline align="center" justify="center" wrap="wrap" gap="300" style={{ minHeight: '48px' }}>
      <DownloadButton
        href={DOWNLOAD_LINKS['mac-arm'].href}
        label={DOWNLOAD_LINKS['mac-arm'].label}
        size={size}
        variant="primary"
        onClick={() => handleDownloadClick('mac-arm')}
      />
      <DownloadButton
        href={DOWNLOAD_LINKS['mac-intel'].href}
        label={DOWNLOAD_LINKS['mac-intel'].label}
        size={size}
        variant="secondary"
        onClick={() => handleDownloadClick('mac-intel')}
      />
    </Inline>
  )
}
