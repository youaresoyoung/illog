import { style } from '@vanilla-extract/css'
import { tokens } from 'packages/themes/dist'
import { backgroundColors, borderColors } from '../../core/tokens/generatedColors'

export const cardBase = style({
  width: '100%',
  border: `${tokens.size.stroke.border}px solid ${backgroundColors.backgroundDefaultDefault}`,

  selectors: {
    '&:hover': {
      border: `${tokens.size.stroke.border}px solid ${borderColors.borderDefaultDefault}`
    }
  }
})
