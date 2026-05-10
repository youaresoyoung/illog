import Image from 'next/image'
import Logo from '@/app/assets/images/logo@x4.png'
import { Box, Stack, Text } from '@/app/components/common/UI'
import { SubHeading } from '../common/SubHeading'
import { DownloadButtons } from '../common/DownloadButtons'

export function DownloadSection() {
  return (
    <Box
      as="section"
      id="download"
      px="600"
      py="2400"
      borderTop="border"
      borderColor="borderDefaultSecondary"
      bg="backgroundDefaultSecondary"
    >
      <Stack align="center" gap="600" style={{ margin: '0 auto', textAlign: 'center' }}>
        <Image width={240} src={Logo} alt="illog Logo" />
        <SubHeading text="Start capturing your days." />
        <Text
          as="p"
          textStyle="bodyBase"
          color="textDefaultSecondary"
          style={{ marginBottom: '16px' }}
        >
          Free to use. No sign-up required. Your data stays on your machine.
        </Text>
        <DownloadButtons size="md" isShowAll={true} />
      </Stack>
    </Box>
  )
}
