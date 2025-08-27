import Icons from '../../assets/svg'
import { NestedKeys } from '../../core/types'
import { getKeyFromPath } from '../../utils/util'
import { tokens } from '@illog/themes'
import { IconName } from './types'

type IconColorToken = NestedKeys<typeof tokens.colors.light.icon>

export type IconProps = {
  name: IconName
  size?: keyof typeof tokens.size.icon
  color?: IconColorToken
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
        color: color
          ? getKeyFromPath(color, tokens.colors.light.icon)
          : tokens.colors.light.icon.default.default
      }}
      aria-label={name}
      role="img"
    />
  )
}
