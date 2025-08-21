import { sprinkles, Sprinkles } from '../core/sprinkles.css'

export function splitSprinkleProps<T extends Record<string, unknown>>(
  props: T
): [Partial<Sprinkles>, Omit<T, keyof Sprinkles>] {
  const sprinkleKeys = new Set<keyof Sprinkles>(sprinkles.properties)
  const sprinkleProps: Partial<Sprinkles> = {}
  const restProps: Partial<T> = {}

  for (const key in props) {
    if (sprinkleKeys.has(key as keyof Sprinkles)) {
      sprinkleProps[key as keyof Sprinkles] = props[key] as Sprinkles[keyof Sprinkles]
    } else {
      restProps[key as keyof T] = props[key]
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
