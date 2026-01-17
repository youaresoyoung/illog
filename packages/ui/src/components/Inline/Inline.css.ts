import { createVar, style } from '@vanilla-extract/css'

export const hoverBgVar = createVar()
export const hoverColorVar = createVar()
export const activeBgVar = createVar()
export const activeColorVar = createVar()

export const inlineInteractive = style({
  transition: 'background-color 0.15s ease, color 0.15s ease',
  selectors: {
    '&:hover': {
      backgroundColor: hoverBgVar,
      color: hoverColorVar
    },
    '&[data-active="true"]': {
      backgroundColor: activeBgVar,
      color: activeColorVar
    }
  }
})
