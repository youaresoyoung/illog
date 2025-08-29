import Icons from '../../assets/svg'
import { tokens } from '@illog/themes'
import { IconName } from './types'
import { iconColors } from '../../core/tokens/generatedColors'

export type IconProps = {
  name: IconName
  size?: keyof typeof tokens.size.icon
  color?: keyof typeof iconColors
}

export const Icon = (props: IconProps) => {
  const { name, size = 'medium', color } = props

  const IconComponent = Icons[name]

  if (!IconComponent) {
    console.warn(`Icon with name "${name}" does not exist.`)
    return null
  }

  return (
    <IconComponent
      width={tokens.size.icon[size]}
      height={tokens.size.icon[size]}
      style={{
        color: color ? iconColors[color] : iconColors.iconDefaultDefault
      }}
      aria-label={name}
      role="img"
    />
  )
}
