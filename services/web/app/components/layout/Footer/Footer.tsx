import Link from 'next/link'
import styles from './Footer.module.css'

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span className={styles.logo}>illog</span>
        <div className={styles.right}>
          <Link href="/privacy" className={styles.link}>
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
