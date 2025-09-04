import { style } from '@vanilla-extract/css'
import { sprinkles } from '../../core/sprinkles.css'
import { recipe } from '@vanilla-extract/recipes'
import { styles, tokens } from 'packages/themes/dist'
import { backgroundColors, borderColors, textColors } from '../../core/tokens/generatedColors'

export const inputWrapper = style([
  sprinkles({
    display: 'flex',
    flexDirection: 'column',
    gap: '100'
  })
])

const inputBase = {
  width: '100%',
  backgroundColor: backgroundColors.backgroundDefaultDefault,
  borderRadius: tokens.size.radius[100],
  border: `${tokens.size.stroke.border}px solid ${backgroundColors.backgroundDefaultDefault}`,
  transition: 'border-color 0.2s',
  ...styles.text.bodyStrong,
  padding: tokens.size.space[200]
}

export const inputRecipe = recipe({
  base: inputBase,
  variants: {
    size: {
      sm: {},
      md: {},
      lg: {}
    },
    variant: {
      default: {
        ':hover': {
          borderColor: borderColors.borderDefaultDefault
        },
        ':focus': {
          borderColor: borderColors.borderDefaultDefault
        },
        ':disabled': {
          color: textColors.textDisabledDefault
        }
      },
      error: {},
      success: {}
    },
    isFullWidth: {
      true: {
        width: '100%'
      },
      false: {
        width: 'auto'
      }
    }
  }
})

export const errorText = style({
  color: textColors.textDangerDefault,
  marginTop: tokens.size.space[100],
  ...styles.text.caption
})
