export function getColorOptions(colorObject: Record<string, any>): string[] {
  return Object.entries(colorObject).reduce((acc, [key, value]) => {
    if (typeof value === "string") {
      acc.push(value);
    } else {
      Object.entries(value).forEach(([subKey, subValue]) => {
        acc.push(`${key}.${subKey}`);
      });
    }
    return acc;
  }, [] as string[]);
}
