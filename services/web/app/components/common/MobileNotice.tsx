'use client'

import { Box, Text } from '@illog/ui'

export const MobileNotice = () => {
  return (
    <Box
      maxWidth="400px"
      p="400"
      bg="backgroundDangerSecondary"
      border="border"
      borderColor="borderDangerDefault"
      rounded="200"
    >
      <Text textStyle="bodySmall" color="textDefaultSecondary">
        Mobile environments do not support installation. Please access from a desktop (Mac or
        Windows) to proceed with the installation.
      </Text>
    </Box>
  )
}
