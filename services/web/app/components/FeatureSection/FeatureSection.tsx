import styles from './FeatureSection.module.css'

import Image from 'next/image'
import { Carousel } from './Carousel'
import { FEATURES } from './data'
import { Badge } from '../common/Badge'
import { SubHeading } from '../common/SubHeading'

export function FeatureSection() {
  return (
    <section className={styles.container}>
      <SubHeading text="Features that capture your day, fully." />
      {FEATURES.map((feature) => (
        <section key={feature.badge} className={styles.featureCard}>
          <div className={styles.content}>
            <Badge text={feature.badge} />
            <h2 className={styles.featureTitle}>{feature.title}</h2>
            <p className={styles.featureDesc}>{feature.description}</p>
          </div>
          <div className={styles.featureMediaWrap}>
            <Image
              src={feature.imageSrc}
              alt={feature.imageAlt}
              sizes="(max-width: 768px) 100vw, 560px"
              className={styles.featureMedia}
            />
          </div>
        </section>
      ))}

      <section className={styles.featureCard}>
        <div className={styles.content}>
          <Badge text="AI Reflection" />
          <h2 className={styles.featureTitle}>{'Your week, reflected\nby AI automatically.'}</h2>
          <p className={styles.featureDesc}>
            AI drafts a weekly reflection based on your task notes. Your records are already there —
            the summary is automatic.
          </p>
        </div>
        <div className={styles.featureMediaWrap}>
          <video
            className={styles.featureMedia}
            src="/videos/feature_ai-reflection.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label="AI Reflection feature demonstration showing automatic weekly summary generation"
          />
        </div>
      </section>

      <Carousel />
    </section>
  )
}
