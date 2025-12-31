import { ReactNode } from 'react'
import { Box, Text } from '@illog/ui'

type Props = {
  title: string
  button?: ReactNode
}

export const ContentHeader = ({ title, button }: Props) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Text as="h2" textStyle="subheading">
        {title}
      </Text>
      {button}
    </Box>
  )
}
