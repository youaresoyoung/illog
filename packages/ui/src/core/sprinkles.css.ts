import { createSprinkles, defineProperties } from '@vanilla-extract/sprinkles'
import { tokens, styles } from '@illog/themes'
import { backgroundColors, borderColors, textColors } from './tokens/generatedColors'

const space = tokens.size.space

const spacingProperties = defineProperties({
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

const colorProperties = defineProperties({
  properties: {
    backgroundColor: backgroundColors,
    color: textColors,
    borderColor: borderColors
  },
  shorthands: {
    bg: ['backgroundColor']
  }
})

const borderProperties = defineProperties({
  properties: {
    borderWidth: tokens.size.stroke,
    borderTopWidth: tokens.size.stroke,
    borderRightWidth: tokens.size.stroke,
    borderBottomWidth: tokens.size.stroke,
    borderLeftWidth: tokens.size.stroke,
    borderColor: borderColors,
    borderTopColor: borderColors,
    borderRightColor: borderColors,
    borderBottomColor: borderColors,
    borderLeftColor: borderColors,
    borderRadius: tokens.size.radius,
    borderStyle: ['solid', 'dashed', 'dotted', 'double', 'none'],
    borderTopStyle: ['solid', 'dashed', 'dotted', 'double', 'none'],
    borderRightStyle: ['solid', 'dashed', 'dotted', 'double', 'none'],
    borderBottomStyle: ['solid', 'dashed', 'dotted', 'double', 'none'],
    borderLeftStyle: ['solid', 'dashed', 'dotted', 'double', 'none']
  },
  shorthands: {
    rounded: ['borderRadius'],
    border: ['borderWidth'],
    borderTop: ['borderTopWidth'],
    borderRight: ['borderRightWidth'],
    borderBottom: ['borderBottomWidth'],
    borderLeft: ['borderLeftWidth'],
    borderTopW: ['borderTopWidth'],
    borderRightW: ['borderRightWidth'],
    borderBottomW: ['borderBottomWidth'],
    borderLeftW: ['borderLeftWidth']
  }
})

const displayProperties = defineProperties({
  properties: {
    display: [
      'none',
      'block',
      'inline',
      'inline-block',
      'flex',
      'inline-flex',
      'grid',
      'inline-grid'
    ],
    overflow: ['visible', 'hidden', 'scroll', 'auto'],
    position: ['static', 'relative', 'absolute', 'fixed', 'sticky'],
    zIndex: [-1, 0, 1, 10, 100, 1000]
  },
  shorthands: {
    z: ['zIndex']
  }
})

const flexProperties = defineProperties({
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
    flex: ['0', '1', 'initial', 'auto', 'none', '0 0 auto', '1 1 auto'],
    flexGrow: [0, 1],
    flexShrink: [0, 1],
    gap: tokens.size.space
  },
  shorthands: {
    justify: ['justifyContent'],
    align: ['alignItems']
  }
})

const gridProperties = defineProperties({
  properties: {
    gridTemplateColumns: ['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)'],
    gridTemplateRows: ['repeat(1, 1fr)', 'repeat(2, 1fr)'],
    justifyItems: ['start', 'end', 'center', 'stretch'],
    gridAlignItems: ['start', 'end', 'center', 'stretch'],
    gap: tokens.size.space
  },
  shorthands: {
    gridColumns: ['gridTemplateColumns'],
    gridRows: ['gridTemplateRows'],
    gridJustify: ['justifyItems'],
    gridAlign: ['gridAlignItems']
  }
})

const dropShadow = styles.dropShadow

function shadowToCss(shadow: (typeof dropShadow)[keyof typeof dropShadow]) {
  return shadow
    .map((s) => {
      const { x, y } = s.position
      return `${x}px ${y}px ${s.blur}px ${s.spread}px ${s.color}`
    })
    .join(', ')
}

export const shadowTokens = Object.fromEntries(
  Object.entries(dropShadow).map(([k, v]) => [k, shadowToCss(v)])
)

const effectProperties = defineProperties({
  properties: {
    boxShadow: shadowTokens
  },
  shorthands: {
    shadow: ['boxShadow']
  }
})

const sizeProperties = defineProperties({
  properties: {
    width: [
      '0',
      '25%',
      '50%',
      '75%',
      '100%',
      'auto',
      'min-content',
      'max-content',
      'fit-content',
      ...Object.values(space).map((v) => `${v}px`)
    ],
    height: [
      '0',
      '25%',
      '50%',
      '75%',
      '100%',
      'auto',
      'min-content',
      'max-content',
      'fit-content',
      ...Object.values(space).map((v) => `${v}px`)
    ],
    minWidth: ['0', 'min-content', 'max-content', 'fit-content'],
    maxWidth: ['none', 'min-content', 'max-content', 'fit-content', '100%'],
    minHeight: ['0', 'min-content', 'max-content', 'fit-content'],
    maxHeight: ['none', 'min-content', 'max-content', 'fit-content']
  },
  shorthands: {
    w: ['width'],
    h: ['height'],
    minW: ['minWidth'],
    maxW: ['maxWidth'],
    minH: ['minHeight'],
    maxH: ['maxHeight']
  }
})

const textProperties = defineProperties({
  properties: {
    textAlign: ['left', 'right', 'center', 'justify'],
    textDecoration: ['none', 'underline', 'line-through', 'overline'],
    textTransform: ['none', 'capitalize', 'uppercase', 'lowercase'],
    lineHeight: ['normal', '1', '1.25', '1.5', '2'],
    whiteSpace: ['normal', 'nowrap', 'pre', 'pre-wrap', 'pre-line'],
    textOverflow: ['clip', 'ellipsis']
  }
})

const compositionProperties = defineProperties({
  properties: {
    truncate: {
      true: {
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        minWidth: 0
      }
    }
  }
})

export const sprinkles = createSprinkles(
  spacingProperties,
  colorProperties,
  borderProperties,
  displayProperties,
  flexProperties,
  gridProperties,
  effectProperties,
  sizeProperties,
  textProperties,
  compositionProperties
)

export type Sprinkles = Parameters<typeof sprinkles>[0]
