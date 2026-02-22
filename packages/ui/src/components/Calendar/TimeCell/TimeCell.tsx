import { Box } from '../../Box'
import { TimeCellProps } from '../types'
import { Text } from '../../Typography'

export const TimeCell = ({
  title,
  subtitle,
  caption,
  color,
  top,
  height,
  left,
  width,
  onClick,
  style,
  children,
  titleFontSize,
  subtitleFontSize
}: TimeCellProps) => {
  return (
    <Box
      onClick={onClick}
      position="absolute"
      top={top}
      left={left}
      width={width}
      height={height}
      rounded="200"
      py="100"
      px="200"
      cursor={onClick ? 'pointer' : undefined}
      overflow="hidden"
      zIndex={1}
      bg={color.bg || 'backgroundDefaultSecondary'}
      style={{
        borderLeft: `4px solid ${color.border}`,
        ...style
      }}
      _hover={{ filter: 'brightness(0.95)' }}
    >
      {children ?? (
        <>
          <Text
            textStyle="captionStrong"
            style={{ color: color.text, fontSize: titleFontSize }}
            truncate="true"
          >
            {title}
          </Text>
          {subtitle && height > 34 && (
            <Text
              textStyle="caption"
              color="textDefaultSecondary"
              truncate="true"
              style={subtitleFontSize ? { fontSize: subtitleFontSize } : undefined}
            >
              {subtitle}
            </Text>
          )}
          {caption && height > 54 && (
            <Text textStyle="caption" color="textDefaultTertiary" truncate="true">
              {caption}
            </Text>
          )}
        </>
      )}
    </Box>
  )
}
