import { IconName } from '../../components/Icon'

export type NavItem = {
  id: string
  iconName: IconName
  label: string
  to: string
}

export type NavList = NavItem[]
