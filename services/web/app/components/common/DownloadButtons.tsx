'use client'

import { usePlatform } from '@/app/hooks/usePlatform'
import styles from './DownloadButtons.module.css'

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

  // SSR / loading state
  if (platform === null) {
    return (
      <div className={styles.buttons}>
        <span className={styles.skeleton} />
      </div>
    )
  }

  // Mobile - already handled by mobileNotice in parent
  if (isMobile) return null

  const buttonClass = size === 'lg' ? styles.buttonLg : styles.buttonMd

  if (isShowAll) {
    return (
      <div className={styles.buttons}>
        <a
          href={DOWNLOAD_LINKS['mac-arm'].href}
          className={`${styles.buttonPrimary} ${buttonClass}`}
        >
          {DOWNLOAD_LINKS['mac-arm'].label}
        </a>
        <a
          href={DOWNLOAD_LINKS['mac-intel'].href}
          className={`${styles.buttonPrimary} ${buttonClass}`}
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
      >
        {DOWNLOAD_LINKS['mac-intel'].label}
      </a>
    </div>
  )
}
