import styles from './HeroSection.module.css'
import ImageToday from '@/app/assets/illog/images/hero.png'
import Image from 'next/image'
import { DownloadButtons } from '../common/DownloadButtons'

export function HeroSection() {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>A tool to never let a day slip by.</h1>

      <DownloadButtons size="md" />

      <div className={styles.card}>
        <p className={styles.cardText}>
          We do many things every day.
          <br />
          But what we learned, how we grew — none of it stays.
          <br />
          illog records the entire process of starting, working on, and completing tasks.
          <br />
          So at the end of the day, you don&apos;t need to rely on memory. It&apos;s already there.
        </p>
        <Image
          className={styles.todayImg}
          src={ImageToday}
          alt="App screenshot showing today's features"
          sizes="(max-width: 768px) 100vw, 860px"
          priority
        />
      </div>
    </section>
  )
}
