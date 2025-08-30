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
    borderRadius: tokens.size.radius,
    borderWidth: tokens.size.stroke,
    borderStyle: ['solid', 'dashed', 'dotted', 'double', 'none']
  },
  shorthands: {
    rounded: ['borderRadius'],
    border: ['borderWidth']
  }
})

export const sprinkles = createSprinkles(spacingProperties, colorProperties, borderProperties)

export type Sprinkles = Parameters<typeof sprinkles>[0]
