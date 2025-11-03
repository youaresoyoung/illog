import { style, keyframes, styleVariants } from '@vanilla-extract/css'

const fadeIn = keyframes({
  '0%': { opacity: 0 },
  '100%': { opacity: 1 }
})

const fadeOut = keyframes({
  '0%': { opacity: 1 },
  '100%': { opacity: 0 }
})

const slideInFromLeft = keyframes({
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(0)' }
})

const slideOutToLeft = keyframes({
  '0%': { transform: 'translateX(0)' },
  '100%': { transform: 'translateX(-100%)' }
})

const slideInFromRight = keyframes({
  '0%': { transform: 'translateX(100%)' },
  '100%': { transform: 'translateX(0)' }
})

const slideOutToRight = keyframes({
  '0%': { transform: 'translateX(0)' },
  '100%': { transform: 'translateX(100%)' }
})

export const backdrop = style({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: `${fadeIn} 200ms ease-out`
})

export const backdropExit = style({
  animation: `${fadeOut} 200ms ease-out`
})

export const contentBase = style({
  position: 'relative',
  outline: 'none'
})

export const contentAnimation = styleVariants({
  fade: {
    animation: `${fadeIn} 200ms ease-out`,
    animationDelay: '50ms',
    animationFillMode: 'backwards'
  },
  slideLeft: {
    animation: `${slideInFromLeft} 300ms cubic-bezier(0.16, 1, 0.3, 1)`
  },
  slideRight: {
    animation: `${slideInFromRight} 300ms cubic-bezier(0.16, 1, 0.3, 1)`
  }
})

export const contentAnimationExit = styleVariants({
  fade: {
    animation: `${fadeOut} 200ms ease-out`
  },
  slideLeft: {
    animation: `${slideOutToLeft} 300ms cubic-bezier(0.7, 0, 0.84, 0)`
  },
  slideRight: {
    animation: `${slideOutToRight} 300ms cubic-bezier(0.7, 0, 0.84, 0)`
  }
})

export const contentAlignLeft = style({
  justifyContent: 'flex-start'
})

export const contentAlignRight = style({
  justifyContent: 'flex-end'
})
