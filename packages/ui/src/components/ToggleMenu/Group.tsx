import { Inline } from '../Inline'
import { ToggleGroupProps } from './types'

export const Group = ({ children }: ToggleGroupProps) => {
  return (
    <Inline
      gap="0"
      rounded="200"
      borderWidth="border"
      borderColor="borderDefaultDefault"
      borderStyle="solid"
      overflow="hidden"
    >
      {children}
    </Inline>
  )
}
