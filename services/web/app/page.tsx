import { DownloadSection } from './components/DownloadSection/DownloadSection'
import { FeatureSection } from './components/FeatureSection/FeatureSection'
import { HeroSection } from './components/Hero/HeroSection'
import { Footer } from './components/layout/Footer/Footer'
import { Header } from './components/layout/Header/Header'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeatureSection />
        <DownloadSection />
      </main>
      <Footer />
    </>
  )
}
