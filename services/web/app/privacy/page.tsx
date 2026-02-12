import styles from './page.module.css'
import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — illog',
  description: 'illog privacy policy and data handling practices.'
}

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          illog
        </Link>
      </nav>

      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: February 11, 2026</p>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <p className={styles.paragraph}>
            illog is a local-first productivity app that records your daily tasks, time, and
            reflections. We are committed to protecting your privacy. All your data — tasks, notes,
            and records — is stored locally on your device and is never transmitted to our servers.
          </p>
          <p className={styles.paragraph}>
            This policy explains the limited, anonymous data we collect to improve the app
            experience.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Anonymous Error Reporting</h2>
          <p className={styles.paragraph}>
            Error information that occurs during app usage is collected anonymously to help improve
            app stability. This feature is opt-in and can be disabled at any time in the app
            settings.
          </p>

          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Collected Information</h3>
            <ul className={styles.list}>
              <li>App version, Electron version</li>
              <li>Operating system type and version</li>
              <li>System architecture (x64, arm64, etc.)</li>
              <li>Error stack traces</li>
              <li>Error occurrence timestamps</li>
            </ul>
          </div>

          <div className={styles.infoCardAlt}>
            <h3 className={styles.infoCardTitle}>Information NOT Collected</h3>
            <ul className={styles.list}>
              <li>Personally identifiable information (email, name, etc.)</li>
              <li>Local database contents</li>
              <li>Local file paths</li>
            </ul>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Control</h2>
          <p className={styles.paragraph}>
            Anonymous error reporting can be toggled on or off at any time in the app&apos;s
            Settings. When disabled, data collection stops immediately. No previously collected data
            is linked to your identity.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>How We Use the Data</h2>
          <p className={styles.paragraph}>
            Error reports are used solely for the purpose of improving app stability and fixing
            bugs. Each report is identified only by a randomly generated anonymous ID — it is never
            associated with any personal information.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Data Storage</h2>
          <p className={styles.paragraph}>
            All your personal data (tasks, notes, time records, and reflections) is stored
            exclusively on your local device. illog does not operate any cloud storage or sync
            service. Your data stays with you.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Third-Party Services</h2>
          <p className={styles.paragraph}>
            illog does not integrate with any third-party analytics, advertising, or tracking
            services. The only external communication is the optional anonymous error reporting
            described above.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Changes to This Policy</h2>
          <p className={styles.paragraph}>
            We may update this Privacy Policy from time to time. Any changes will be reflected on
            this page with an updated revision date. We encourage you to review this page
            periodically.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Contact</h2>
          <p className={styles.paragraph}>
            If you have any questions about this Privacy Policy, please reach out to us at{' '}
            <a href="mailto:zero.so.jung@gmail.com" className={styles.link}>
              zero.so.jung@gmail.com
            </a>
            .
          </p>
        </section>
      </article>

      <footer className={styles.footer}>
        <span>&copy; {new Date().getFullYear()} illog. All rights reserved.</span>
      </footer>
    </div>
  )
}
