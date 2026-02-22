import Image from 'next/image'
import { Box, Inline, Stack, Text } from '@/app/components/common/UI'
import { Carousel } from './Carousel'
import { FEATURES } from './data'
import { Badge } from '../common/Badge'
import { SubHeading } from '../common/SubHeading'

export function FeatureSection() {
  return (
    <Stack
      as="section"
      gap="1200"
      pt="2400"
      pb="2400"
      px="600"
      width={'100%'}
      maxWidth={1000}
      style={{ margin: '0 auto' }}
    >
      <SubHeading text="Features that capture your day, fully." />

      {FEATURES.map((feature) => (
        <Inline
          as="section"
          key={feature.badge}
          wrap="wrap"
          border="border"
          borderColor="borderDefaultSecondary"
          rounded="400"
          overflow="hidden"
          bg="backgroundDefaultDefault"
          boxShadow="400"
        >
          <Stack style={{ flex: '1 1 280px' }} p="1200" justify="center" gap="400">
            <Badge text={feature.badge} />
            <Text as="h2" textStyle="heading" color="textDefaultDefault">
              {feature.title}
            </Text>
            <Text as="p" textStyle="bodyBase" color="textDefaultSecondary">
              {feature.description}
            </Text>
          </Stack>

          <Box minWidth={280} overflow="hidden" style={{ flex: '1 1 560px' }}>
            <Image
              src={feature.imageSrc}
              alt={feature.imageAlt}
              sizes="(max-width: 768px) 100vw, 640px"
              quality={95}
              style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        </Inline>
      ))}

      <Inline
        as="section"
        wrap="wrap"
        border="border"
        borderColor="borderDefaultSecondary"
        rounded="400"
        overflow="hidden"
        bg="backgroundDefaultDefault"
        boxShadow="400"
      >
        <Stack style={{ flex: '1 1 280px' }} p="1200" justify="center" gap="400">
          <Badge text="AI Reflection" />
          <Text as="h2" textStyle="heading" color="textDefaultDefault">
            {'Your week, reflected\nby AI automatically.'}
          </Text>
          <Text as="p" textStyle="bodyBase" color="textDefaultSecondary">
            AI drafts a weekly reflection based on your task notes. Your records are already there
            {' — '}the summary is automatic.
          </Text>
        </Stack>

        <Box style={{ flex: '1 1 560px', minWidth: '280px', overflow: 'hidden' }}>
          <Box
            as="video"
            src="/videos/feature_ai-reflection.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            aria-label="AI Reflection feature demonstration showing automatic weekly summary generation"
            display="block"
            width={'100%'}
            height={'100%'}
            style={{ objectFit: 'cover' }}
          />
        </Box>
      </Inline>

      <Carousel />
    </Stack>
  )
}
