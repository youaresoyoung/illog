import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'
import { tokens } from '@illog/themes'

const space = tokens.size.space

export const marginAndPaddingProperties = defineProperties({
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
    paddingLeft: space
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

export const sprinkles = createSprinkles(marginAndPaddingProperties)

export type Sprinkles = Parameters<typeof sprinkles>[0]
