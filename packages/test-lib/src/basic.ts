import _ from "lodash";

export function greet(name: string): string {
  return `Hello, ${name}!`;
}

export function calculate(a: number, b: number): number {
  return a + b;
}

export function uniqueArray<T>(arr: T[]): T[] {
  return _.uniq(arr);
}
