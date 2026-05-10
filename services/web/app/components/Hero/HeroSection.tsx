import Image from 'next/image'
import ImageToday from '@/app/assets/illog/images/hero.png'
import { Box, Stack, Text } from '@/app/components/common/UI'
import { DownloadButtons } from '../common/DownloadButtons'

const HERO_COPY = `We do many things every day.
But what we learned, how we grew — none of it stays.
illog records the entire process of starting, working on, and completing tasks.
So at the end of the day, you don't need to rely on memory. It's already there.`

export function HeroSection() {
  return (
    <Stack
      as="section"
      align="center"
      gap="600"
      pt="2400"
      px="600"
      style={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        textAlign: 'center'
      }}
    >
      <Text
        as="h1"
        textStyle="title"
        color="textDefaultDefault"
        style={{
          fontSize: 'clamp(28px, 5vw, 48px)',
          lineHeight: 1.3,
          letterSpacing: '-1px'
        }}
      >
        A tool to never let a day slip by.
      </Text>

      <DownloadButtons size="md" />

      <Box
        w="100%"
        rounded="400"
        overflow="hidden"
        position="relative"
        pt="1200"
        px="1200"
        mt="600"
        style={{
          fontSize: 'clamp(16px, 2vw, 20px)',
          minHeight: 'clamp(400px, 60vw, 580px)',
          background: '#1a1a1a'
        }}
      >
        <Text
          as="p"
          textStyle="bodyBase"
          color="textBrandOnBrand"
          whiteSpace="pre-line"
          lineHeight="2"
        >
          {HERO_COPY}
        </Text>
        <Box
          position="absolute"
          left={'50%'}
          transform={'translateX(-50%)'}
          bottom={0}
          width={'min(860px, 95%)'}
        >
          <Image
            src={ImageToday}
            alt="App screenshot showing today's features"
            sizes="(max-width: 768px) 100vw, 860px"
            quality={95}
            priority
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
        </Box>
      </Box>
    </Stack>
  )
}
