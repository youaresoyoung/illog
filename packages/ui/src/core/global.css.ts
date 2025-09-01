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
