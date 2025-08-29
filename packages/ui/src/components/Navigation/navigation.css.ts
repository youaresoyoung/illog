import { style } from '@vanilla-extract/css'
import { tokens } from 'packages/themes/dist'
import { backgroundColors, borderColors, textColors } from '../../core/tokens/generatedColors'

export const containerBase = style({
  width: 256,
  borderRight: `1px solid ${borderColors.borderDefaultDefault}`
})

export const listBase = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.size.space[200]
})

export const itemBase = style({})

export const itemLinkBase = style({
  width: '100%',
  display: 'inline-flex',
  alignItems: 'center',
  gap: tokens.size.space[300],
  padding: tokens.size.space[300],
  color: textColors.textDefaultDefault,
  backgroundColor: backgroundColors.backgroundDefaultDefault,
  borderRadius: tokens.size.radius[200],

  selectors: {
    '&:hover': {
      backgroundColor: backgroundColors.backgroundDefaultDefaultHover
    }
  }
})
