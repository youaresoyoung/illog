import { Button as _Button } from '@illog/ui'
import { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  component: _Button,
  argTypes: {
    variant: {
      control: {
        type: 'select'
      },
      options: ['primary', 'secondary', 'tertiary']
    },
    size: {
      control: {
        type: 'select'
      },
      options: ['sm', 'md', 'lg']
    },
    isDisabled: {
      control: {
        type: 'boolean'
      }
    },
    isFullWidth: {
      control: {
        type: 'boolean'
      }
    },
    ariaLabel: {
      control: {
        type: 'text'
      }
    }
  }
} satisfies Meta<typeof _Button>

export default meta
type Story = StoryObj<typeof _Button>

export const Button: Story = {}
Button.args = {
  variant: 'primary',
  size: 'md',
  children: 'Button'
}
