import { Stack, Text } from '@illog/ui'

type Props = {
  value: string | number
  label: string
}

export const StatCard = ({ value, label }: Props) => {
  return (
    <Stack
      gap="100"
      px="600"
      py="400"
      backgroundColor="backgroundDefaultSecondary"
      borderRadius="200"
      align="center"
    >
      <Text textStyle="heading" color="textDefaultDefault">
        {value}
      </Text>
      <Text textStyle="caption" color="textDefaultTertiary">
        {label}
      </Text>
    </Stack>
  )
}
