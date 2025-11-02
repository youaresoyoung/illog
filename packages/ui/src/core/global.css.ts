import { globalStyle } from '@vanilla-extract/css'

globalStyle('*', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0
})

globalStyle('li', {
  listStyle: 'none'
})

globalStyle('a', {
  textDecoration: 'none',
  color: 'inherit'
})

globalStyle('input', {
  border: 'none',
  outline: 'none',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  color: 'inherit'
})

globalStyle('button', {
  background: 'transparent',
  border: 'none',
  outline: 'none',
  font: 'inherit',
  color: 'inherit',
  cursor: 'pointer'
})

globalStyle('dialog', {
  border: 'none'
})

globalStyle('dialog::backdrop', {
  background: 'rgba(0, 0, 0, 0.5)'
})
