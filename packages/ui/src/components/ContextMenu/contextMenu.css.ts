import { style, keyframes } from '@vanilla-extract/css'
import { styles, tokens } from '@illog/themes'
import { sprinkles } from '../../core/sprinkles.css'
import { backgroundColors, borderColors, textColors } from '../../core/tokens/generatedColors'

const fadeIn = keyframes({
  from: { opacity: 0, transform: 'scale(0.96)' },
  to: { opacity: 1, transform: 'scale(1)' }
})

export const content = style([
  sprinkles({ shadow: '400' }),
  {
    position: 'fixed',
    zIndex: 1000,
    minWidth: 180,
    backgroundColor: backgroundColors.backgroundDefaultDefault,
    border: `${tokens.size.stroke.border}px solid ${borderColors.borderDefaultDefault}`,
    borderRadius: tokens.size.radius[200],
    padding: tokens.size.space[100],
    overflow: 'hidden',
    outline: 'none',
    animation: `${fadeIn} 0.15s ease-out`
  }
])

export const item = style([
  styles.text.bodyBase,
  {
    display: 'flex',
    alignItems: 'center',
    gap: tokens.size.space[200],
    padding: `${tokens.size.space[200]}px ${tokens.size.space[300]}px`,
    borderRadius: tokens.size.radius[100],
    cursor: 'default',
    userSelect: 'none',
    outline: 'none',
    color: textColors.textDefaultDefault,

    selectors: {
      '&[data-highlighted]': {
        backgroundColor: backgroundColors.backgroundDefaultDefaultHover
      },
      '&[data-disabled]': {
        cursor: 'not-allowed',
        opacity: 0.5,
        pointerEvents: 'none'
      }
    }
  }
])

export const subTrigger = style([
  item,
  {
    justifyContent: 'space-between',

    selectors: {
      '&[data-state="open"]': {
        backgroundColor: backgroundColors.backgroundDefaultDefaultHover
      }
    }
  }
])
