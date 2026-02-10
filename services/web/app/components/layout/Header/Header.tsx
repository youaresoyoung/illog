'use client'

import { Button } from '@illog/ui'
import styles from './Header.module.css'
import Image from 'next/image'
import logo from '@/app/assets/images/logo@x2.png'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Image width={120} src={logo} alt="Illog Logo" />
        <Button
          variant="primary"
          size="md"
          onClick={() => {
            document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })
          }}
        >
          Download
        </Button>
      </div>
    </header>
  )
}
