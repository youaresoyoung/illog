import { sprinkles, Sprinkles } from "../core/sprinkles.css";

export function splitSprinkleProps<T extends Record<string, any>>(
  props: T
): [Sprinkles, Omit<T, keyof Sprinkles>] {
  const sprinkleKeys = new Set<keyof Sprinkles>(sprinkles.properties);
  const sprinkleProps: any = {};
  const restProps: any = {};

  for (const key in props) {
    if (sprinkleKeys.has(key as keyof Sprinkles)) {
      sprinkleProps[key] = props[key];
    } else {
      restProps[key] = props[key];
    }
  }

  return [sprinkleProps, restProps];
}

export function getKeyFromPath<T extends Record<string, any>>(
  path: string,
  obj: T
): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}
