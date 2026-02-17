import { ReactNode } from 'react'
import { Box, Inline, Text } from '@illog/ui'

type Props = {
  title: string
  actions?: ReactNode
  button?: ReactNode
}

export const ContentHeader = ({ title, actions, button }: Props) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap="400"
      overflow="hidden"
    >
      <Text as="h2" textStyle="heading" truncate="true" flex="1">
        {title}
      </Text>
      <Inline gap="200" align="center" flexShrink={0}>
        {actions}
        {button}
      </Inline>
    </Box>
  )
}
