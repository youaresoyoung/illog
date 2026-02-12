import { style } from '@vanilla-extract/css'
import { styles, tokens } from '@illog/themes'
import {
  backgroundColors,
  borderColors,
  textColors
} from 'packages/ui/src/core/tokens/generatedColors'

export const trigger = style([
  styles.text.bodyBase,
  {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.size.space[200],
    padding: `${tokens.size.space[100]}px ${tokens.size.space[200]}px`,
    backgroundColor: backgroundColors.backgroundDefaultDefault,
    border: `${tokens.size.stroke.border}px solid ${borderColors.borderDefaultDefault}`,
    borderRadius: tokens.size.radius[200],
    color: textColors.textDefaultDefault,
    cursor: 'pointer',
    userSelect: 'none',
    minWidth: '200px',

    selectors: {
      '&:hover': {
        backgroundColor: backgroundColors.backgroundDefaultDefaultHover,
        borderColor: borderColors.borderDefaultDefault
      },
      '&:focus': {
        outline: 'none',
        borderColor: borderColors.borderBrandDefault
      },
      '&[data-disabled]': {
        cursor: 'not-allowed',
        opacity: 0.5,
        backgroundColor: backgroundColors.backgroundDisabledDefault
      },
      '&[data-placeholder]': {
        color: textColors.textDefaultTertiary
      }
    }
  }
])

export const value = style({
  flex: 1,
  textAlign: 'left',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
})

export const content = style({
  position: 'fixed',
  zIndex: 1000,
  backgroundColor: backgroundColors.backgroundDefaultDefault,
  border: `${tokens.size.stroke.border}px solid ${borderColors.borderDefaultDefault}`,
  borderRadius: tokens.size.radius[200],
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  maxHeight: '300px',

  selectors: {
    '&[data-state="open"]': {
      animation: 'fadeIn 0.15s ease-out'
    },
    '&[data-state="closed"]': {
      animation: 'fadeOut 0.15s ease-in'
    }
  }
})

export const viewport = style({
  padding: tokens.size.space[100],
  overflowY: 'auto',
  maxHeight: '280px'
})

export const item = style([
  styles.text.bodyBase,
  {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.size.space[200],
    borderRadius: tokens.size.radius[100],
    cursor: 'pointer',
    userSelect: 'none',
    outline: 'none',
    color: textColors.textDefaultDefault,
    ...styles.text.singleLine.bodyBase,
    padding: `${tokens.size.space[200]}px ${tokens.size.space[300]}px`,

    selectors: {
      '&:hover': {
        backgroundColor: backgroundColors.backgroundDefaultDefaultHover
      },
      '&:focus': {
        backgroundColor: backgroundColors.backgroundDefaultDefaultHover
      },
      '&[data-state="checked"]': {
        backgroundColor: backgroundColors.backgroundBrandSecondary,
        color: textColors.textBrandDefault
      },
      '&[data-disabled]': {
        cursor: 'not-allowed',
        opacity: 0.5,
        pointerEvents: 'none'
      }
    }
  }
])
