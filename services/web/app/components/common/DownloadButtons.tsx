'use client'

import { usePlatform } from '@/app/hooks/usePlatform'
import { useUmami } from '@/app/hooks/useUmami'
import { DOWNLOAD_CLICKED } from '@illog/analytics'
import styles from './DownloadButtons.module.css'
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

export function DownloadButtons({ size = 'md', isShowAll = false }: Props) {
  const { platform, isMobile } = usePlatform()
  const { track } = useUmami()

  const handleDownloadClick = (downloadPlatform: string) => {
    track(DOWNLOAD_CLICKED, { platform: downloadPlatform })
  }

  // SSR / loading state
  if (platform === null) {
    return (
      <div className={styles.buttons}>
        <span className={styles.skeleton} />
      </div>
    )
  }

  if (isMobile) return <MobileNotice />

  const buttonClass = size === 'lg' ? styles.buttonLg : styles.buttonMd

  if (isShowAll) {
    return (
      <div className={styles.buttons}>
        <a
          href={DOWNLOAD_LINKS['mac-arm'].href}
          className={`${styles.buttonPrimary} ${buttonClass}`}
          onClick={() => handleDownloadClick('mac-arm')}
        >
          {DOWNLOAD_LINKS['mac-arm'].label}
        </a>
        <a
          href={DOWNLOAD_LINKS['mac-intel'].href}
          className={`${styles.buttonPrimary} ${buttonClass}`}
          onClick={() => handleDownloadClick('mac-intel')}
        >
          {DOWNLOAD_LINKS['mac-intel'].label}
        </a>
        <button className={`${styles.buttonDisabled} ${buttonClass}`} disabled>
          {DOWNLOAD_LINKS.windows.label}
        </button>
      </div>
    )
  }

  if (platform === 'windows') {
    return (
      <div className={styles.buttons}>
        <button className={`${styles.buttonDisabled} ${buttonClass}`} disabled>
          {DOWNLOAD_LINKS.windows.label}
        </button>
      </div>
    )
  }

  if (platform === 'mac-arm') {
    return (
      <div className={styles.buttons}>
        <a
          href={DOWNLOAD_LINKS['mac-arm'].href}
          className={`${styles.buttonPrimary} ${buttonClass}`}
          onClick={() => handleDownloadClick('mac-arm')}
        >
          {DOWNLOAD_LINKS['mac-arm'].label}
        </a>
      </div>
    )
  }

  if (platform === 'mac-intel') {
    return (
      <div className={styles.buttons}>
        <a
          href={DOWNLOAD_LINKS['mac-intel'].href}
          className={`${styles.buttonPrimary} ${buttonClass}`}
          onClick={() => handleDownloadClick('mac-intel')}
        >
          {DOWNLOAD_LINKS['mac-intel'].label}
        </a>
      </div>
    )
  }

  // Mac (unknown arch) - show both
  if (platform === 'mac') {
    return (
      <div className={styles.buttons}>
        <a
          href={DOWNLOAD_LINKS['mac-arm'].href}
          className={`${styles.buttonPrimary} ${buttonClass}`}
          onClick={() => handleDownloadClick('mac-arm')}
        >
          {DOWNLOAD_LINKS['mac-arm'].label}
        </a>
        <a
          href={DOWNLOAD_LINKS['mac-intel'].href}
          className={`${styles.buttonSecondary} ${buttonClass}`}
        >
          {DOWNLOAD_LINKS['mac-intel'].label}
        </a>
      </div>
    )
  }

  // Linux / unknown - show all mac options
  return (
    <div className={styles.buttons}>
      <a href={DOWNLOAD_LINKS['mac-arm'].href} className={`${styles.buttonPrimary} ${buttonClass}`}>
        {DOWNLOAD_LINKS['mac-arm'].label}
      </a>
      <a
        href={DOWNLOAD_LINKS['mac-intel'].href}
        className={`${styles.buttonSecondary} ${buttonClass}`}
        onClick={() => handleDownloadClick('mac-intel')}
      >
        {DOWNLOAD_LINKS['mac-intel'].label}
      </a>
    </div>
  )
}
