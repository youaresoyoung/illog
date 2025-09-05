import { style } from '@vanilla-extract/css'
import { backgroundColors, borderColors, textColors } from '../../core/tokens/generatedColors'
import { styles, tokens } from '@illog/themes'

export const container = style({
  position: 'fixed',
  top: tokens.size.space['negative200'],
  left: 0,
  zIndex: 1000,
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.size.space[200],
  width: 296,
  maxHeight: 400,
  padding: tokens.size.space[200],
  backgroundColor: backgroundColors.backgroundDefaultDefault,
  border: `${tokens.size.stroke.border}px solid ${borderColors.borderDefaultDefault}`,
  borderRadius: tokens.size.radius[200]
})

export const inputWrapper = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: tokens.size.space[200],
  padding: tokens.size.space[200],
  borderRadius: tokens.size.radius[100],
  backgroundColor: backgroundColors.backgroundDefaultSecondary
})

export const tagListContainer = style({
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.size.space[200]
})

export const tagListDescription = style({
  color: textColors.textDefaultSecondary,
  ...styles.text.captionStrong
})

export const tagList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.size.space[200],
  justifyContent: 'flex-start'
})

export const tagItem = style({
  padding: `${tokens.size.space[100]}px ${tokens.size.space[200]}px`,
  borderRadius: tokens.size.radius[200],
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: backgroundColors.backgroundDefaultDefaultHover
    }
  }
})

export const createNewTagButton = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.size.space[200],
  textAlign: 'left',
  color: textColors.textDefaultSecondary,
  ...styles.text.captionStrong
})

export const input = style({
  backgroundColor: 'transparent',
  color: textColors.textDefaultDefault,
  ...styles.text.bodySmall,

  selectors: {
    '&::placeholder': {
      color: textColors.textDefaultTertiary
    }
  }
})
