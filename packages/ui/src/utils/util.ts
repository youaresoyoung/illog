import { sprinkles, Sprinkles } from '../core/sprinkles.css'

export function extractSprinkleProps<T extends Record<string, unknown>>(
  props: T
): [Partial<Sprinkles>, Omit<T, keyof Sprinkles>] {
  const sprinkleKeys = new Set<keyof Sprinkles>(sprinkles.properties)
  const sprinkleProps: Partial<Sprinkles> = {}
  const restProps: Partial<T> = {}

  for (const key in props) {
    const typedKey = key as keyof T
    if (sprinkleKeys.has(typedKey as keyof Sprinkles)) {
      type K = Extract<typeof typedKey, keyof Sprinkles>
      sprinkleProps[typedKey as K] = props[typedKey] as Sprinkles[K]
    } else {
      restProps[typedKey] = props[typedKey]
    }
  }

  return [sprinkleProps, restProps as Omit<T, keyof Sprinkles>]
}

type Path<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object ? `${K}` | `${K}.${Path<T[K]>}` : `${K}`
    }[keyof T & string]
  : never

type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never

export function getKeyFromPath<T extends object, P extends Path<T>>(
  path: P,
  obj: T
): PathValue<T, P> | undefined {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (typeof acc === 'object' && acc !== null && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj) as PathValue<T, P> | undefined
}
