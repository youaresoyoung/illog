import { StaticImageData } from 'next/image'

export type Feature = {
  badge: string
  title: string
  description: string
  imageSrc: StaticImageData
  imageAlt: string
}
