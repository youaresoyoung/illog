import { PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'

export type PortalProps = PropsWithChildren<{
  container?: Element | DocumentFragment
}>

export const Portal = ({ children, container }: PortalProps) => {
  if (!children) return null

  const target = container ?? (typeof document !== 'undefined' ? document.body : null)
  if (!target) return null

  return createPortal(children, target)
}
