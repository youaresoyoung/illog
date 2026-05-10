'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Box, Icon, Inline, Stack, Text } from '@/app/components/common/UI'
import { THIS_WEEK_FEATURES } from './data'
import { Badge } from '../common/Badge'

export function Carousel() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c === 0 ? THIS_WEEK_FEATURES.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === THIS_WEEK_FEATURES.length - 1 ? 0 : c + 1))
  const item = THIS_WEEK_FEATURES[current]

  return (
    <Box position="relative" display="flex" align="center" pb="1200" gap="400">
      <Box
        as="button"
        type="button"
        aria-label="Previous"
        onClick={prev}
        border="border"
        borderColor="borderDefaultSecondary"
        rounded="full"
        bg="backgroundDefaultDefault"
        position="absolute"
        left={22}
        zIndex={1}
        width={44}
        height={44}
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        opacity={0.92}
        _hover={{ bg: 'backgroundDefaultSecondary' }}
      >
        <Icon name="chevron_down" rotate={90} />
      </Box>

      <Box
        w="100%"
        rounded="400"
        border="border"
        borderColor="borderDefaultSecondary"
        overflow="hidden"
        bg="backgroundDefaultDefault"
        boxShadow="400"
      >
        <Stack gap="0">
          <Stack p="1200" pb="800" gap="300">
            <Badge text={item.badge} />
            <Text as="h3" textStyle="heading" color="textDefaultDefault">
              {item.title}
            </Text>
            <Text as="p" textStyle="bodySmall" color="textDefaultSecondary">
              {item.description}
            </Text>
          </Stack>

          <Box bg="backgroundDefaultSecondary">
            <Image
              src={item.imageSrc}
              alt={item.imageAlt}
              sizes="(max-width: 768px) 100vw, 952px"
              quality={95}
              style={{ display: 'block', width: '100%', height: 'auto' }}
            />
          </Box>
        </Stack>
      </Box>

      <Box
        as="button"
        type="button"
        aria-label="Next"
        onClick={next}
        border="border"
        borderColor="borderDefaultSecondary"
        rounded="full"
        position="absolute"
        right={22}
        zIndex={1}
        width={44}
        height={44}
        display="flex"
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        opacity={0.92}
        bg="backgroundDefaultDefault"
        _hover={{ bg: 'backgroundDefaultSecondary' }}
      >
        <Icon name="chevron_down" rotate={-90} />
      </Box>

      <Inline
        align="center"
        justify="center"
        position="absolute"
        bottom={60}
        left={'50%'}
        transform="translateX(-50%)"
        gap="200"
      >
        {THIS_WEEK_FEATURES.map((_, i) => (
          <Box
            as="button"
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrent(i)}
            rounded="full"
            width={8}
            height={8}
            bg={i === current ? 'backgroundBrandDefault' : 'backgroundDefaultTertiary'}
            cursor="pointer"
          />
        ))}
      </Inline>
    </Box>
  )
}
