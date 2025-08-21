import { sprinkles, Sprinkles } from '../core/sprinkles.css'

export function splitSprinkleProps<T extends Record<string, any>>(
  props: T
): [Partial<Sprinkles>, Omit<T, keyof Sprinkles>] {
  const sprinkleKeys = new Set<keyof Sprinkles>(sprinkles.properties)
  const sprinkleProps: Partial<Sprinkles> = {}
  const restProps: Partial<T> = {}

  for (const key in props) {
    if (sprinkleKeys.has(key as keyof Sprinkles)) {
      sprinkleProps[key as keyof Sprinkles] = props[key]
    } else {
      restProps[key as keyof T] = props[key]
    }
  }

  return [sprinkleProps, restProps as Omit<T, keyof Sprinkles>]
}

export function getKeyFromPath<T extends Record<string, any>>(path: string, obj: T): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}
