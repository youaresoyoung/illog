export type PropRow = {
  name: string
  type: string
  default: string | null
  required: boolean
  description: string
}

export type SpecRow = {
  selector: string
  state: string
  element: string
  property: string
  token: string | null
  value: string
  reason?: string
}

export type ComponentSpec = {
  id: string
  name: string
  description: string
  status: { figma: string; react: string }
  elements: Record<string, { element?: string; description?: string }>
  states: string[]
  extends: string | null
  propsTable: PropRow[]
  specTable: SpecRow[]
}
