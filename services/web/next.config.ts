import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@illog/themes',
    '@illog/ui',
    '@illog/ui/index.css',
    '@illog/themes/themes.css'
  ],
  reactCompiler: true
}

export default nextConfig
