import { tokens } from '@illog/themes'
import { Icon as _Icon } from '@illog/ui'
import { IconNameOptions } from '@illog/ui'
import { Meta, StoryObj } from '@storybook/react-vite'
import { getColorOptions } from '../../../utils/getColorOptions'

const colors = getColorOptions('icon', tokens.colors.light.icon)
const meta = {
  component: _Icon,
  argTypes: {
    name: {
      control: 'select',
      options: IconNameOptions
    },
    size: {
      control: 'select',
      options: tokens.size.icon ? Object.keys(tokens.size.icon) : []
    },
    color: {
      control: 'select',
      options: colors
    }
  }
} satisfies Meta<typeof _Icon>

export default meta
type Story = StoryObj<typeof _Icon>

export const Icon: Story = {}
Icon.args = {
  name: 'check',
  size: 'medium',
  color: 'iconDefaultDefault'
}
