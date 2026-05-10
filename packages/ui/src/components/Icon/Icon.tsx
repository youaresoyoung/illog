import Icons from '../../assets/svg'
import { tokens } from '@illog/themes'
import { IconName } from './types'
import { iconColors, textColors } from '../../core/tokens/generatedColors'

const isKeyOf = <T extends object>(obj: T, key: PropertyKey): key is keyof T => {
  return key in obj
}

export type IconProps = {
  name: IconName
  size?: keyof typeof tokens.size.icon
  color?: keyof typeof iconColors | keyof typeof textColors
  rotate?: number
}

export const Icon = (props: IconProps) => {
  const { name, size = 'medium', color, rotate } = props

  const IconComponent = Icons[name]

  if (!IconComponent) {
    console.warn(`Icon with name "${name}" does not exist.`)
    return null
  }

  const iconColor = color
    ? isKeyOf(iconColors, color)
      ? iconColors[color]
      : isKeyOf(textColors, color)
        ? textColors[color]
        : iconColors.iconDefaultDefault
    : iconColors.iconDefaultDefault

  return (
    <IconComponent
      width={tokens.size.icon[size]}
      height={tokens.size.icon[size]}
      style={{
        color: iconColor,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        transition: 'transform 0.3s ease'
      }}
      aria-label={name}
      role="img"
    />
  )
}
