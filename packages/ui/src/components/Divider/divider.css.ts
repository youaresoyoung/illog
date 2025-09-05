import { style } from '@vanilla-extract/css'
import { borderColors } from '../../core/tokens/generatedColors'
import { tokens } from 'packages/themes/dist'
import { recipe } from '@vanilla-extract/recipes'

export const dividerBase = style({
  flexShrink: 0
})

export const divider = recipe({
  base: dividerBase,

  variants: {
    orientation: {
      horizontal: { width: '100%', borderTop: '1px solid' },
      vertical: { height: '100%', borderLeft: '1px solid' }
    },
    variant: {
      solid: { borderStyle: 'solid' },
      dashed: { borderStyle: 'dashed' }
    },
    color: {
      default: { borderColor: borderColors.borderDefaultDefault }
    },
    thickness: {
      thin: { borderWidth: tokens.size.stroke.border }
    }
  },

  defaultVariants: {
    orientation: 'horizontal',
    variant: 'solid',
    color: 'default',
    thickness: 'thin'
  }
})
