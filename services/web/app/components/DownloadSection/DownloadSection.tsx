'use client'

import styles from './DownloadSection.module.css'
import Logo from '@/app/assets/images/logo@x4.png'
import Image from 'next/image'
import { SubHeading } from '../common/SubHeading'
import { DownloadButtons } from '../common/DownloadButtons'
import { usePlatform } from '@/app/hooks/usePlatform'
import { MobileNotice } from '../common/MobileNotice'

export function DownloadSection() {
  const { isMobile } = usePlatform()

  return (
    <section id="download" className={styles.download}>
      <div className={styles.inner}>
        <Image width={240} src={Logo} alt="illog Logo" />
        <SubHeading text="Start capturing your days." />
        <p className={styles.subtitle}>
          Free to use. No sign-up required. Your data stays on your machine.
        </p>
        {isMobile ? <MobileNotice /> : <DownloadButtons size="md" isShowAll={true} />}
      </div>
    </section>
  )
}
