import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://illog.app', lastModified: new Date(), priority: 1 },
    { url: 'https://illog.app/privacy', lastModified: new Date(), priority: 0.3 }
  ]
}
