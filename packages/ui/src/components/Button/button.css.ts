import { recipe } from '@vanilla-extract/recipes'
import { styles, tokens } from '@illog/themes'
import { backgroundColors, borderColors, textColors } from '../../core/tokens/generatedColors'

const buttonBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: tokens.size.radius[200],
  cursor: 'pointer',
  border: 'none',
  textDecoration: 'none',
  backgroundColor: 'transparent',
  color: textColors.textDefaultDefault,
  appearance: 'none' as const,
  transition: 'all 0.2s ease-in-out',
  ...styles.text.singleLine.bodyBase
}

export const buttonRecipe = recipe({
  base: buttonBase,
  variants: {
    size: {
      sm: {},
      md: { padding: tokens.size.space[300], height: '2.5rem' },
      lg: {}
    },
    variant: {
      primary: {
        color: textColors.textBrandOnBrand,
        border: `${tokens.size.stroke.border}px solid ${borderColors.borderBrandDefault}`,
        backgroundColor: backgroundColors.backgroundBrandDefault,

        ':hover': {
          color: textColors.textBrandOnBrand,
          backgroundColor: backgroundColors.backgroundBrandDefaultHover
        },
        ':disabled': {
          cursor: 'default',
          color: textColors.textDisabledDefault,
          backgroundColor: backgroundColors.backgroundDisabledDefault,
          borderColor: borderColors.borderDisabledDefault
        }
      },
      secondary: {
        color: textColors.textBrandDefault,
        border: `${tokens.size.stroke.border}px solid ${borderColors.borderDefaultDefault}`,
        backgroundColor: backgroundColors.backgroundDefaultDefault,

        ':hover': {
          color: textColors.textDefaultDefault,
          backgroundColor: backgroundColors.backgroundDefaultDefaultHover
        },
        ':disabled': {
          cursor: 'default',
          color: textColors.textDisabledDefault,
          backgroundColor: backgroundColors.backgroundDisabledDefault,
          borderColor: borderColors.borderDisabledDefault
        }
      }
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
