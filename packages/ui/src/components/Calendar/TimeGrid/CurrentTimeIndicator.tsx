import { Box } from '../../Box'
import { Inline } from '../../Inline'
import { Text } from '../../Typography'
import { CurrentTimeIndicatorProps } from '../types'

export const CurrentTimeIndicator = ({
  nowMinutes,
  hourHeight,
  gutterWidth,
  columns,
  currentTimeColumn,
  timeLabel
}: CurrentTimeIndicatorProps) => {
  const top = (nowMinutes / 60) * hourHeight
  const isSingleColumn = columns <= 1

  return (
    <Box
      position="absolute"
      top={top}
      left={0}
      right={0}
      zIndex={1000}
      pointerEvents="none"
      display="flex"
      alignItems="center"
    >
      <Inline width={gutterWidth} flexShrink={0}>
        <Inline bg="backgroundBrandDefault" rounded="200" py="100" px="200">
          <Text textStyle="caption" color="textBrandOnBrand">
            {timeLabel}
          </Text>
        </Inline>
      </Inline>

      {isSingleColumn ? (
        <Box
          height={2}
          bg="backgroundBrandDefault"
          style={{
            flex: 1
          }}
        />
      ) : (
        Array.from({ length: columns }, (_, i) => (
          <Box
            key={i}
            bg={i === currentTimeColumn ? 'backgroundBrandDefault' : 'transparent'}
            height={i === currentTimeColumn ? 2 : 1}
            style={{
              flex: 1
            }}
          />
        ))
      )}
    </Box>
  )
}
