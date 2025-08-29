import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'
import { tokens } from '@illog/themes'
import { backgroundColors, borderColors, textColors } from './tokens/generatedColors'

const space = tokens.size.space

export const spacingProperties = defineProperties({
  properties: {
    margin: space,
    marginTop: space,
    marginRight: space,
    marginBottom: space,
    marginLeft: space,
    padding: space,
    paddingTop: space,
    paddingRight: space,
    paddingBottom: space,
    paddingLeft: space,
    gap: space,
    gridGap: space,
    columnGap: space,
    rowGap: space
  },
  shorthands: {
    m: ['margin'],
    mt: ['marginTop'],
    mr: ['marginRight'],
    mb: ['marginBottom'],
    ml: ['marginLeft'],
    mx: ['marginLeft', 'marginRight'],
    my: ['marginTop', 'marginBottom'],
    p: ['padding'],
    pt: ['paddingTop'],
    pr: ['paddingRight'],
    pb: ['paddingBottom'],
    pl: ['paddingLeft'],
    px: ['paddingLeft', 'paddingRight'],
    py: ['paddingTop', 'paddingBottom']
  }
})

export const colorProperties = defineProperties({
  properties: {
    backgroundColor: backgroundColors,
    color: textColors,
    borderColor: borderColors
  },
  shorthands: {
    bg: ['backgroundColor']
  }
})

export const borderProperties = defineProperties({
  properties: {
    borderWidth: tokens.size.stroke,
    borderColor: borderColors,
    borderRadius: tokens.size.radius,
    borderStyle: ['solid', 'dashed', 'dotted', 'double', 'none']
  },
  shorthands: {
    rounded: ['borderRadius'],
    border: ['borderWidth'],
    borderStyle: ['borderStyle']
  }
})

export const displayProperties = defineProperties({
  properties: {
    display: ['none', 'block', 'inline', 'inline-block', 'flex', 'grid'],
    overflow: ['visible', 'hidden', 'scroll', 'auto'],
    position: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    top: ['0', 'auto'],
    right: ['0', 'auto'],
    bottom: ['0', 'auto'],
    left: ['0', 'auto'],
    zIndex: [0, 1, 10, 100, 1000]
  },
  shorthands: {
    inset: ['top', 'right', 'bottom', 'left'],
    z: ['zIndex']
  }
})

export const flexProperties = defineProperties({
  properties: {
    flexDirection: ['row', 'row-reverse', 'column', 'column-reverse'],
    flexWrap: ['nowrap', 'wrap', 'wrap-reverse'],
    justifyContent: [
      'flex-start',
      'flex-end',
      'center',
      'space-between',
      'space-around',
      'space-evenly'
    ],
    alignItems: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
    alignContent: ['flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around'],
    alignSelf: ['auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
    gap: tokens.size.space
  },
  shorthands: {
    justify: ['justifyContent'],
    align: ['alignItems']
  }
})

export const gridProperties = defineProperties({
  properties: {
    gridTemplateColumns: ['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)'],
    gridTemplateRows: ['repeat(1, 1fr)', 'repeat(2, 1fr)'],
    justifyItems: ['start', 'end', 'center', 'stretch'],
    alignItems: ['start', 'end', 'center', 'stretch'],
    gap: tokens.size.space
  },
  shorthands: {
    gridColumns: ['gridTemplateColumns'],
    gridRows: ['gridTemplateRows'],
    gridJustify: ['justifyItems'],
    gridAlign: ['alignItems']
  }
})

export const sprinkles = createSprinkles(
  spacingProperties,
  colorProperties,
  borderProperties,
  displayProperties,
  flexProperties,
  gridProperties
)

export type Sprinkles = Parameters<typeof sprinkles>[0]
