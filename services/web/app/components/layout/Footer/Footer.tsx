'use client'

import Link from 'next/link'
import styles from './Footer.module.css'
import { useUmami } from '@/app/hooks/useUmami'
import { FOOTER_LINK_CLICKED } from '@illog/analytics'

export function Footer() {
  const { track } = useUmami()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.logo}>illog</span>
        <div className={styles.right}>
          <Link
            href="/privacy"
            className={styles.link}
            onClick={() => track(FOOTER_LINK_CLICKED, { target: 'privacy' })}
          >
            Privacy Policy
          </Link>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} illog. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}
