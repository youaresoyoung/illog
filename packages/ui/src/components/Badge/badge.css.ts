import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { styles, tokens } from '@illog/themes'
import { backgroundColors, borderColors, textColors } from '../../core/tokens/generatedColors'

export const badgeBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: tokens.size.space[100],
  borderRadius: tokens.size.radius[100],
  ...styles.text.singleLine.caption,
  padding: tokens.size.space[200]
})

export const removeButton = style({
  display: 'flex',
  alignItems: 'center'
})

export const badgeRecipe = recipe({
  base: badgeBase,
  variants: {
    color: {
      blue: style({
        backgroundColor: backgroundColors.backgroundTagBlue,
        color: textColors.textTagBlue
      }),
      gray: style({
        backgroundColor: backgroundColors.backgroundTagGray,
        color: textColors.textTagGray
      }),
      green: style({
        backgroundColor: backgroundColors.backgroundTagGreen,
        color: textColors.textTagGreen
      }),
      purple: style({
        backgroundColor: backgroundColors.backgroundTagPurple,
        color: textColors.textTagPurple
      }),
      red: style({
        backgroundColor: backgroundColors.backgroundTagRed,
        color: textColors.textTagRed
      }),
      yellow: style({
        backgroundColor: backgroundColors.backgroundTagYellow,
        color: textColors.textTagYellow
      })
    }
  }
})

export const addButtonRecipe = recipe({
  base: {
    height: 28,
    border: `${tokens.size.stroke.border}px dashed ${borderColors.borderDefaultSecondary}`
  },
  variants: {
    variant: {
      default: {
        backgroundColor: backgroundColors.backgroundDefaultDefault,
        color: textColors.textDefaultSecondary,

        '&:hover': {
          backgroundColor: backgroundColors.backgroundDefaultDefaultHover,
          color: textColors.textDefaultDefault,
          borderColor: borderColors.borderDefaultTertiary
        }
      },
      error: {
        backgroundColor: backgroundColors.backgroundDangerSecondary,
        color: textColors.textDangerDefault,
        borderColor: borderColors.borderDangerDefault
      }
    }
  }
})
