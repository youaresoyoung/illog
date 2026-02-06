import { Box } from '../../Box'
import { Text } from '../../Typography'
import type { DayColumnHeadersProps } from '../types'
import { DEFAULT_GUTTER_WIDTH } from '../constants'

const DEFAULT_HEIGHT = 40

export const DayColumnHeaders = ({
  days,
  gutterWidth = DEFAULT_GUTTER_WIDTH,
  height = DEFAULT_HEIGHT
}: DayColumnHeadersProps) => {
  return (
    <Box
      display="flex"
      borderBottomStyle="solid"
      borderBottom="border"
      borderColor="borderDefaultDefault"
      height={height}
    >
      <Box
        width={gutterWidth}
        flexShrink={0}
        borderRight="border"
        borderRightStyle="solid"
        borderColor="borderDefaultDefault"
      />

      {days.map((dayHead, i) => (
        <Box
          key={i}
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="100"
          borderRight={i < days.length - 1 ? 'border' : undefined}
          borderRightStyle="solid"
          borderColor="borderDefaultDefault"
          style={{ flex: 1 }}
        >
          <Text
            textStyle="caption"
            color={dayHead.isToday ? 'textBrandDefault' : 'textDefaultTertiary'}
          >
            {dayHead.label}
          </Text>
          <Box
            width={24}
            height={24}
            display="flex"
            alignItems="center"
            justifyContent="center"
            rounded="full"
            bg={dayHead.isToday ? 'backgroundBrandDefault' : undefined}
          >
            <Text
              textStyle="captionStrong"
              color={dayHead.isToday ? 'textBrandOnBrand' : 'textDefaultDefault'}
              lineHeight="1"
            >
              {dayHead.dateNum}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  )
}
