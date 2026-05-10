import { CSSProperties } from '@vanilla-extract/css'

const properties = [
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'top',
  'right',
  'bottom',
  'left',
  'inset',
  'transform',
  'translate',
  'scale',
  'rotate',
  'opacity',
  'cursor',
  'transition',
  'transitionProperty',
  'transitionDuration',
  'transitionTimingFunction',
  'transitionDelay',
  'overflow',
  'overflowX',
  'overflowY',
  'pointerEvents',
  'userSelect',
  'outline',
  'outlineOffset',
  'outlineColor',
  'outlineStyle',
  'outlineWidth'
] as const

export type StyleProps = {
  [key in (typeof properties)[number]]?: CSSProperties[key]
}

export function convertStylePropsToCSS(props: StyleProps): CSSProperties {
  const style: CSSProperties = {}

  const directProps = properties.filter(
    (prop) => prop !== 'translate' && prop !== 'scale' && prop !== 'rotate'
  )

  directProps.forEach((prop) => {
    if (props[prop] !== undefined) {
      // NOTE: style[prop as keyof CSSProperties] cause TypeScript TS2590 error
      // CSSProperties has many properties, making it difficult for the TypeScript compiler to accurately infer the type when indexing.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(style as any)[prop] = props[prop]
    }
  })

  if (props.translate || props.scale || props.rotate) {
    const transforms = []

    if (props.translate) transforms.push(`translate(${props.translate})`)
    if (props.scale) transforms.push(`scale(${props.scale})`)
    if (props.rotate) transforms.push(`rotate(${props.rotate})`)

    style.transform = transforms.join(' ')
  }

  return style
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractStyleProps<T extends Record<string, any>>(
  props: T
): [StyleProps, Omit<T, keyof StyleProps>] {
  const stylePropsKeys = new Set(properties)

  const styleProps: StyleProps = {}
  const restProps = { ...props }

  Object.keys(props).forEach((key) => {
    if (stylePropsKeys.has(key as keyof StyleProps)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(styleProps as any)[key] = props[key]
      delete restProps[key]
    }
  })

  return [styleProps, restProps as Omit<T, keyof StyleProps>]
}
