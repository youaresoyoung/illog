import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@illog/analytics',
    '@illog/themes',
    '@illog/ui',
    '@illog/ui/index.css',
    '@illog/themes/themes.css'
  ],
  images: {
    qualities: [75, 90, 95]
  },
  reactCompiler: true
}

export default nextConfig
