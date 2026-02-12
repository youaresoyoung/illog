import { ReactNode } from 'react'
import { Sprinkles } from '../../core/sprinkles.css'
import { IconName } from '../Icon'

/**
 * URL matching strategy for Navigation.Item
 * - 'exact': Only matches when pathname === to
 * - 'startsWith': Matches when pathname starts with to (useful for nested routes)
 * - 'endsWith': Matches when pathname ends with to
 */
export type MatchStrategy = 'exact' | 'startsWith' | 'endsWith'

/**
 * Props passed to render functions (className, style, children)
 */
export type ItemRenderProps = {
  isActive: boolean
  isPending: boolean
}

export type ContainerProps = {
  className?: string
  children: ReactNode
}

export type ListProps = {
  className?: string
  children: ReactNode
  /**
   * URL matching strategy for all items in this list
   * @default 'exact'
   */
  match?: MatchStrategy
} & Sprinkles

export type ItemProps = {
  /**
   * Navigation destination (also used for active state matching)
   */
  to: string
  /**
   * Optional icon name (only used when children is not a function)
   */
  iconName?: IconName
  /**
   * Item content - can be ReactNode or render function
   * @example
   * // Simple
   * <Item to="/">Home</Item>
   *
   * // Render function
   * <Item to="/">
   *   {({ isActive }) => <>{isActive ? '→' : ''} Home</>}
   * </Item>
   */
  children: ReactNode | ((props: ItemRenderProps) => ReactNode)
  /**
   * className - can be string or function
   * @example
   * className={({ isActive }) => isActive ? 'active' : ''}
   */
  className?: string | ((props: ItemRenderProps) => string)
  /**
   * style - can be object or function
   * @example
   * style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}
   */
  style?: React.CSSProperties | ((props: ItemRenderProps) => React.CSSProperties)
  /**
   * Click handler
   */
  onClick?: (e: React.MouseEvent) => void
  /**
   * Disabled state
   */
  disabled?: boolean
  /**
   * Accessible label
   */
  'aria-label'?: string
  /**
   * URL matching strategy
   * @default 'exact'
   */
  match?: MatchStrategy
  /**
   * Match when URL ends with this path (for hash routing, etc.)
   */
  end?: boolean
}
