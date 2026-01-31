import { ReactNode } from 'react'
import { Box, Text } from '@illog/ui'

type Props = {
  title: string
  button?: ReactNode
}

export const ContentHeader = ({ title, button }: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap="400"
      overflow="hidden"
    >
      <Text as="h2" textStyle="subheading" truncate="true" flex="1">
        {title}
      </Text>
      {button && <Box flexShrink={0}>{button}</Box>}
    </Box>
  )
}
