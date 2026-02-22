import { Box } from '@/app/components/common/UI'
import { DownloadSection } from './components/DownloadSection/DownloadSection'
import { FeatureSection } from './components/FeatureSection/FeatureSection'
import { HeroSection } from './components/Hero/HeroSection'
import { Footer } from './components/layout/Footer/Footer'
import { Header } from './components/layout/Header/Header'

export default function Home() {
  return (
    <>
      <Header />
      <Box as="main">
        <HeroSection />
        <FeatureSection />
        <DownloadSection />
      </Box>
      <Footer />
    </>
  )
}
