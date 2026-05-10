'use client'

import { Text } from '@illog/ui'

export const SubHeading = ({ text }: { text: string }) => {
  return (
    <Text as="h2" textStyle="subtitle" align="center" mb="200">
      {text}
    </Text>
  )
}
