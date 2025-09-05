import { styles } from '@illog/themes'
import { style } from '@vanilla-extract/css'
import { backgroundColors, borderColors, textColors } from '../../core/tokens/generatedColors'
import { tokens } from 'packages/themes/dist'

export const editorContainer = style({
  background: backgroundColors.backgroundDefaultDefault,
  borderRadius: tokens.size.radius[200],
  padding: tokens.size.space[200],
  minWidth: 200,
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.size.space[200],
  border: `${tokens.size.stroke.border}px solid ${borderColors.borderDefaultDefault}`
})

export const nameInput = style({
  display: 'flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: tokens.size.space[200],
  padding: tokens.size.space[200],
  borderRadius: tokens.size.radius[100],
  backgroundColor: backgroundColors.backgroundDefaultSecondary
})

export const deleteRow = style({
  display: 'flex',
  alignItems: 'center'
})

export const deleteButton = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  background: 'none',
  border: 'none',
  color: textColors.textDefaultDefault,
  cursor: 'pointer',
  borderRadius: tokens.size.radius[200],
  ...styles.text.caption,
  padding: `${tokens.size.space[100]}px ${tokens.size.space[200]}px`,
  gap: tokens.size.space[200],
  selectors: {
    '&:hover': {
      backgroundColor: backgroundColors.backgroundDefaultDefaultHover
    }
  }
})

export const colorList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: tokens.size.space[200]
})

export const colorItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: tokens.size.space[200],
  cursor: 'pointer',
  padding: `${tokens.size.space[100]}px ${tokens.size.space[200]}px`,
  borderRadius: tokens.size.radius[200],
  transition: 'background 0.2s',
  selectors: {
    '&:hover': {
      backgroundColor: backgroundColors.backgroundDefaultDefaultHover
    }
  }
})

export const colorPreview = style({
  width: 24,
  height: 24,
  borderRadius: tokens.size.radius[100],
  flexShrink: 0
})

export const colorName = style({
  ...styles.text.caption
})
