import { Text } from '@illog/ui'
import { Meta, StoryObj } from '@storybook/react-vite'
import { styles, tokens } from '@illog/themes'
import '@illog/ui/style.css'
import { getColorOptions } from '../../../utils/getColorOptions'

const colors = getColorOptions(tokens.colors.light.text)
const meta = {
  component: Text,
  argTypes: {
    as: {
      control: { type: 'select' },
      options: ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
    },
    textStyle: {
      control: { type: 'select' },
      options: Object.keys(styles.text)
    },
    color: {
      control: { type: 'select' },
      options: colors
    },
    align: {
      control: { type: 'select' },
      options: ['left', 'center', 'right', 'justify']
    },
    padding: {
      control: { type: 'select' },
      options: Object.keys(tokens.size.space)
    }
  }
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof Text>

export const Primary: Story = {}
Primary.args = {
  textStyle: 'heading',
  color: 'brand.default',
  children: 'Hello, world!'
}
