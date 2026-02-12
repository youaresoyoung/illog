import { Box } from '../../Box'
import { Text } from '../../Typography'
import { HourRowProps } from '../types'
import { formatHour } from '../utils'

export const HourRow = ({ hour, hourHeight, gutterWidth, columns }: HourRowProps) => {
  return (
    <Box
      key={hour}
      position="absolute"
      top={hour * hourHeight}
      left={0}
      right={0}
      height={hourHeight}
      borderBottomStyle="solid"
      borderBottom="border"
      borderColor="borderDefaultDefault"
      display="flex"
    >
      <Box
        width={gutterWidth}
        flexShrink={0}
        pt="200"
        pl={columns > 1 ? '200' : '400'}
        borderRight="border"
        borderRightStyle="solid"
        borderColor="borderDefaultDefault"
      >
        <Text textStyle="caption" color="textDefaultTertiary">
          {formatHour(hour)}
        </Text>
      </Box>

      {columns > 1 &&
        Array.from({ length: columns }, (_, i) => (
          <Box
            key={i}
            borderRight={i < columns - 1 ? 'border' : undefined}
            borderRightStyle="solid"
            borderColor="borderDefaultDefault"
            style={{ flex: 1 }}
          />
        ))}
    </Box>
  )
}
