'use client'

import { useState } from 'react'
import Image from 'next/image'

import styles from './Carousel.module.css'
import { Icon } from '@illog/ui'
import { THIS_WEEK_FEATURES } from './data'
import { Badge } from '../common/Badge'

export function Carousel() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c === 0 ? THIS_WEEK_FEATURES.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === THIS_WEEK_FEATURES.length - 1 ? 0 : c + 1))
  const item = THIS_WEEK_FEATURES[current]

  return (
    <div className={styles.carousel}>
      <button
        className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
        onClick={prev}
        aria-label="Previous"
      >
        <Icon name="chevron_down" rotate={90} />
      </button>
      <div className={styles.carouselCard}>
        <div className={styles.carouselDesc}>
          <Badge text={item.badge} />
          <h3 className={styles.carouselTitle}>{item.title}</h3>
          <p className={styles.carouselText}>{item.description}</p>
        </div>
        <div className={styles.carouselImageWrap}>
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            sizes="(max-width: 768px) 100vw, 700px"
            className={styles.carouselImage}
          />
        </div>
      </div>
      <button
        className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
        onClick={next}
        aria-label="Next"
      >
        <Icon name="chevron_down" rotate={-90} />
      </button>
      <div className={styles.carouselDots}>
        {THIS_WEEK_FEATURES.map((_, i) => (
          <button
            key={i}
            className={`${styles.carouselDot} ${i === current ? styles.carouselDotActive : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
