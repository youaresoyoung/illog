export type SelectorColor = 'blue' | 'gray' | 'green' | 'purple' | 'red' | 'yellow'

const SELECTOR_COLORS: SelectorColor[] = ['blue', 'gray', 'green', 'purple', 'red', 'yellow']

export const pickRandomColor = (): SelectorColor => {
  return SELECTOR_COLORS[Math.floor(Math.random() * SELECTOR_COLORS.length)]
}
