'use client'

import { Inline, Text } from '@illog/ui'

export const Badge = ({ text }: { text: string }) => {
  return (
    <Inline
      as="span"
      bg="backgroundDefaultSecondary"
      px="300"
      py="100"
      rounded="400"
      mb="300"
      alignSelf="flex-start"
    >
      <Text as="span" textStyle="captionStrong" color="textDefaultSecondary">
        {text}
      </Text>
    </Inline>
  )
}
