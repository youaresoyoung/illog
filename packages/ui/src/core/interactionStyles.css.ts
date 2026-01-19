import { createVar, style, StyleRule } from '@vanilla-extract/css'

export const hoverBgVar = createVar()
export const hoverColorVar = createVar()
export const hoverBorderColorVar = createVar()
export const hoverOpacityVar = createVar()
export const hoverBoxShadowVar = createVar()

export const activeBgVar = createVar()
export const activeColorVar = createVar()
export const activeBorderColorVar = createVar()
export const activeOpacityVar = createVar()
export const activeBoxShadowVar = createVar()

export const focusBgVar = createVar()
export const focusColorVar = createVar()
export const focusBorderColorVar = createVar()
export const focusOpacityVar = createVar()
export const focusBoxShadowVar = createVar()

export const focusVisibleBgVar = createVar()
export const focusVisibleColorVar = createVar()
export const focusVisibleBorderColorVar = createVar()
export const focusVisibleOpacityVar = createVar()
export const focusVisibleBoxShadowVar = createVar()

export const disabledBgVar = createVar()
export const disabledColorVar = createVar()
export const disabledBorderColorVar = createVar()
export const disabledOpacityVar = createVar()
export const disabledBoxShadowVar = createVar()

export const interactionVars = {
  _hover: {
    bg: hoverBgVar,
    color: hoverColorVar,
    borderColor: hoverBorderColorVar,
    opacity: hoverOpacityVar,
    boxShadow: hoverBoxShadowVar
  },
  _active: {
    bg: activeBgVar,
    color: activeColorVar,
    borderColor: activeBorderColorVar,
    opacity: activeOpacityVar,
    boxShadow: activeBoxShadowVar
  },
  _focus: {
    bg: focusBgVar,
    color: focusColorVar,
    borderColor: focusBorderColorVar,
    opacity: focusOpacityVar,
    boxShadow: focusBoxShadowVar
  },
  _focusVisible: {
    bg: focusVisibleBgVar,
    color: focusVisibleColorVar,
    borderColor: focusVisibleBorderColorVar,
    opacity: focusVisibleOpacityVar,
    boxShadow: focusVisibleBoxShadowVar
  },
  _disabled: {
    bg: disabledBgVar,
    color: disabledColorVar,
    borderColor: disabledBorderColorVar,
    opacity: disabledOpacityVar,
    boxShadow: disabledBoxShadowVar
  }
} as const

const createStateStyles = (
  vars: (typeof interactionVars)[keyof typeof interactionVars]
): StyleRule => ({
  backgroundColor: vars.bg,
  color: vars.color,
  borderColor: vars.borderColor,
  opacity: vars.opacity,
  boxShadow: vars.boxShadow
})

export const interactiveBase = style({
  transition:
    'background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease',
  selectors: {
    '&:hover:not(:disabled):not([data-disabled="true"])': createStateStyles(interactionVars._hover),
    '&:active:not(:disabled):not([data-disabled="true"])': createStateStyles(
      interactionVars._active
    ),
    '&[data-active="true"]': createStateStyles(interactionVars._active),
    '&:focus': createStateStyles(interactionVars._focus),
    '&:focus-visible': createStateStyles(interactionVars._focusVisible),
    '&:disabled, &[data-disabled="true"]': {
      ...createStateStyles(interactionVars._disabled),
      cursor: 'not-allowed'
    }
  }
})
