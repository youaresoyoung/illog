import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'
import { styles, tokens } from '@illog/themes'
import { backgroundColors, borderColors, textColors } from '../../core/tokens/generatedColors'

export const tagBase = style({
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  borderRadius: tokens.size.radius[100],
  ...styles.text.singleLine.caption,
  padding: `${tokens.size.space[150]}px ${tokens.size.space[300]}px`
})

export const tagAddButton = style({
  height: 24,
  gap: tokens.size.space[100],
  border: `${tokens.size.stroke.border}px dashed ${borderColors.borderDefaultSecondary}`
})

export const tagRecipe = recipe({
  base: tagBase,
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
