import { Stack, Text } from '@illog/ui'

type Props = {
  value: string | number
  label: string
}

export const StatItem = ({ value, label }: Props) => {
  return (
    <Stack gap="200" px="600" borderRadius="200" align="center">
      <Text textStyle="heading" color="textDefaultDefault">
        {value}
      </Text>
      <Text textStyle="caption" color="textDefaultTertiary">
        {label}
      </Text>
    </Stack>
  )
}
