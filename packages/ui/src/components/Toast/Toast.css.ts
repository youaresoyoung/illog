import { style, keyframes, styleVariants } from '@vanilla-extract/css'

const slideIn = keyframes({
  '0%': { opacity: 0, transform: 'translateX(100%)' },
  '100%': { opacity: 1, transform: 'translateX(0)' }
})

const slideOut = keyframes({
  '0%': { opacity: 1, transform: 'translateX(0)' },
  '100%': { opacity: 0, transform: 'translateX(100%)' }
})

export const container = style({
  position: 'fixed',
  top: 16,
  right: 16,
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  pointerEvents: 'none'
})

export const item = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 16px',
  borderRadius: 8,
  minWidth: 280,
  maxWidth: 400,
  pointerEvents: 'auto',
  animation: `${slideIn} 200ms ease-out`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
})

export const itemExiting = style({
  animation: `${slideOut} 150ms ease-in forwards`
})

export const itemType = styleVariants({
  error: {
    backgroundColor: 'var(--background-danger-secondary)',
    border: '1px solid var(--border-danger-default)',
    color: 'var(--text-danger-default)'
  },
  success: {
    backgroundColor: 'var(--background-success-secondary, #e6f7ea)',
    border: '1px solid var(--border-success-default, #009933)',
    color: 'var(--text-success-default, #007a29)'
  },
  warning: {
    backgroundColor: 'var(--background-warning-secondary, #fff9e6)',
    border: '1px solid var(--border-warning-default, #e6b800)',
    color: 'var(--text-warning-default, #806a00)'
  },
  info: {
    backgroundColor: 'var(--background-brand-tertiary)',
    border: '1px solid var(--border-brand-tertiary)',
    color: 'var(--text-brand-default)'
  }
})

export const message = style({
  flex: 1,
  fontSize: 13,
  lineHeight: 1.4,
  fontWeight: 500
})

export const closeButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 20,
  height: 20,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  opacity: 0.6,
  borderRadius: 4,
  color: 'inherit',
  fontSize: 14,
  lineHeight: 1,
  padding: 0,
  ':hover': {
    opacity: 1,
    backgroundColor: 'var(--background-default-secondary-hover)'
  }
})
