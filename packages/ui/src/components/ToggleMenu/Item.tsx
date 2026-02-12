import { Box } from '../Box'
import { Icon } from '../Icon'
import { Text } from '../Typography'
import { ToggleItemProps } from './types'

const SIZES = {
  small: 28,
  medium: 32
} as const

export const Item = ({ item, index, value, size = 'medium', onChange }: ToggleItemProps) => {
  const buttonSize = SIZES[size]

  return (
    <Box key={item.value} display="flex" alignItems="center">
      {index > 0 && <Box width={1} alignSelf="stretch" bg="backgroundDefaultSecondary" />}
      <Box
        as="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap="100"
        cursor="pointer"
        backgroundColor={
          value === item.value ? 'backgroundDefaultSecondary' : 'backgroundDefaultDefault'
        }
        style={{
          border: 'none',
          outline: 'none',
          minWidth: buttonSize,
          height: buttonSize,
          padding: item.label ? '0 8px' : undefined
        }}
        onClick={() => onChange(item.value)}
        aria-label={item.ariaLabel ?? item.label ?? item.value}
        aria-pressed={value === item.value}
      >
        {item.icon && (
          <Icon
            name={item.icon}
            size="small"
            color={value === item.value ? 'iconDefaultDefault' : 'iconDefaultTertiary'}
          />
        )}
        {item.label && (
          <Text
            textStyle="caption"
            color={value === item.value ? 'textDefaultDefault' : 'textDefaultTertiary'}
          >
            {item.label}
          </Text>
        )}
      </Box>
    </Box>
  )
}
