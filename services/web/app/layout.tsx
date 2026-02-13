import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Google_Sans } from 'next/font/google'
import '@illog/themes/themes.css'
import '@illog/ui/index.css'
import './globals.css'

const geistSans = Google_Sans({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap'
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
}

export const metadata: Metadata = {
  metadataBase: new URL('https://illog.app'),
  title: 'illog — A tool to never let a day slip by',
  description:
    "illog records the entire process of starting, working on, and completing tasks. So at the end of the day, you don't need to rely on memory.",
  keywords: [
    'productivity',
    'task tracker',
    'daily log',
    'time tracking',
    'desktop app',
    'local-first'
  ],
  openGraph: {
    title: 'illog — A tool to never let a day slip by',
    description:
      "illog records the entire process of starting, working on, and completing tasks. So at the end of the day, you don't need to rely on memory.",
    url: 'https://illog.app',
    siteName: 'illog',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'illog — A tool to never let a day slip by'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'illog — A tool to never let a day slip by',
    description:
      "illog records the entire process of starting, working on, and completing tasks. So at the end of the day, you don't need to rely on memory.",
    images: ['/og-image.png']
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable}`}>
        {children}
        {process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
          />
        )}
      </body>
    </html>
  )
}
