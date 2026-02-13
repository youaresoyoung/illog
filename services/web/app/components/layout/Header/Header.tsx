'use client'

import { Button } from '@illog/ui'
import styles from './Header.module.css'
import Image from 'next/image'
import logo from '@/app/assets/images/logo@x2.png'
import { useUmami } from '@/app/hooks/useUmami'
import { HEADER_NAV_CLICKED } from '@illog/analytics'

export function Header() {
  const { track } = useUmami()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Image width={120} src={logo} alt="Illog Logo" />
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
      </div>
    </header>
  )
}
