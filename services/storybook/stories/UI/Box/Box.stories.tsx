import type { Meta, StoryObj } from '@storybook/react'
import { Box } from '@illog/ui'
import BoxMdx from './Box.mdx'
import { styles, tokens } from '@illog/themes'
import { getColorOptions } from '../../../utils/getColorOptions'
import {
  ALIGN_ITEMS_VALUES,
  AS_VALUES,
  BORDER_STYLE_VALUES,
  DISPLAY_VALUES,
  FLEX_DIRECTION_VALUES,
  JUSTIFY_CONTENT_VALUES,
  POSITION_VALUES
} from '../../../utils/css-properties'

const meta = {
  title: 'Foundation/Layout/Box',
  component: Box,
  parameters: {
    layout: 'centered',
    docs: {
      page: BoxMdx
    }
  },
  argTypes: {
    as: {
      control: { type: 'select' },
      options: AS_VALUES,
      description: 'Specifies the HTML element to render',
      table: {
        type: { summary: AS_VALUES.join(' | ') },
        defaultValue: { summary: 'div' },
        category: 'Element'
      }
    },
    children: {
      control: { type: 'text' },
      description: 'Content to be rendered inside the Box',
      table: {
        type: { summary: 'ReactNode' },
        category: 'Content'
      }
    },
    display: {
      control: { type: 'select' },
      options: DISPLAY_VALUES,
      description: 'CSS display property',
      table: {
        type: { summary: DISPLAY_VALUES.join(' | ') },
        category: 'Layout',
        subcategory: 'Display'
      }
    },
    flexDirection: {
      control: { type: 'select' },
      options: FLEX_DIRECTION_VALUES,
      description: 'Flex item direction',
      table: {
        type: { summary: FLEX_DIRECTION_VALUES.join(' | ') },
        category: 'Layout',
        subcategory: 'Flexbox'
      }
    },
    alignItems: {
      control: { type: 'select' },
      options: ALIGN_ITEMS_VALUES,
      description: 'Vertical alignment of Flex items',
      table: {
        type: { summary: ALIGN_ITEMS_VALUES.join(' | ') },
        category: 'Layout',
        subcategory: 'Flexbox'
      }
    },
    justifyContent: {
      control: { type: 'select' },
      options: JUSTIFY_CONTENT_VALUES,
      description: 'Horizontal alignment of Flex items',
      table: {
        type: { summary: JUSTIFY_CONTENT_VALUES.join(' | ') },
        category: 'Layout',
        subcategory: 'Flexbox'
      }
    },
    gap: {
      control: { type: 'select' },
      options: Object.keys(tokens.size.space),
      description: 'Spacing between Flex/Grid items',
      table: {
        type: { summary: Object.keys(tokens.size.space).join(' | ') },
        category: 'Layout',
        subcategory: 'Flexbox'
      }
    },
    p: {
      control: { type: 'select' },
      options: Object.keys(tokens.size.space),
      description: 'Internal paddings in all directions',
      table: {
        type: { summary: Object.keys(tokens.size.space).join(' | ') },
        category: 'Spacing',
        subcategory: 'Padding'
      }
    },
    px: {
      control: { type: 'select' },
      options: Object.keys(tokens.size.space),
      description: 'Left and right internal paddings',
      table: {
        type: { summary: Object.keys(tokens.size.space).join(' | ') },
        category: 'Spacing',
        subcategory: 'Padding'
      }
    },
    py: {
      control: { type: 'select' },
      options: Object.keys(tokens.size.space),
      description: 'Top and bottom internal paddings',
      table: {
        type: { summary: Object.keys(tokens.size.space).join(' | ') },
        category: 'Spacing',
        subcategory: 'Padding'
      }
    },
    m: {
      control: { type: 'select' },
      options: Object.keys(tokens.size.space),
      description: 'External margins in all directions',
      table: {
        type: { summary: Object.keys(tokens.size.space).join(' | ') },
        category: 'Spacing',
        subcategory: 'Margin'
      }
    },
    w: {
      control: { type: 'text' },
      description: 'Width (px, %, vw etc)',
      table: {
        type: { summary: 'string | number' },
        category: 'Sizing'
      }
    },
    h: {
      control: { type: 'text' },
      description: 'Height (px, %, vh etc)',
      table: {
        type: { summary: 'string | number' },
        category: 'Sizing'
      }
    },
    maxW: {
      control: { type: 'text' },
      description: 'Max witdh',
      table: {
        type: { summary: 'string | number' },
        category: 'Sizing'
      }
    },
    bg: {
      control: { type: 'select' },
      options: getColorOptions('background', tokens.colors.light.background),
      description: 'Background color',
      table: {
        type: {
          summary: getColorOptions('background', tokens.colors.light.background).join(' | ')
        },
        category: 'Visual',
        subcategory: 'Background'
      }
    },
    rounded: {
      control: { type: 'select' },
      options: Object.keys(tokens.size.radius),
      description: 'Border radius',
      table: {
        type: { summary: Object.keys(tokens.size.radius).join(' | ') },
        category: 'Visual',
        subcategory: 'Border'
      }
    },
    border: {
      control: { type: 'select' },
      options: Object.keys(tokens.size.stroke),
      description: 'Border width',
      table: {
        type: {
          summary: Object.keys(tokens.size.stroke).join(' | ')
        },
        category: 'Visual',
        subcategory: 'Border'
      }
    },
    borderColor: {
      control: { type: 'select' },
      description: 'Border color',
      options: getColorOptions('border', tokens.colors.light.border),
      table: {
        type: { summary: getColorOptions('border', tokens.colors.light.border).join(' | ') },
        category: 'Visual',
        subcategory: 'Border'
      }
    },
    borderStyle: {
      control: { type: 'select' },
      description: 'Border style',
      options: BORDER_STYLE_VALUES,
      table: {
        type: { summary: BORDER_STYLE_VALUES.join(' | ') },
        category: 'Visual',
        subcategory: 'Border'
      }
    },
    position: {
      control: { type: 'select' },
      options: POSITION_VALUES,
      description: 'CSS position properties',
      table: {
        type: { summary: POSITION_VALUES.join(' | ') },
        category: 'Position'
      }
    },
    shadow: {
      control: { type: 'select' },
      options: Object.keys(styles.dropShadow),
      description: 'Box shadow property',
      table: {
        type: { summary: Object.keys(styles.dropShadow).join(' | ') },
        category: 'Visual',
        subcategory: 'Background'
      }
    },
    className: {
      control: { type: 'text' },
      description: 'Adding classname',
      table: {
        type: { summary: 'string' },
        category: 'Advanced'
      }
    },
    style: {
      control: { type: 'object' },
      description: 'Inline style object',
      table: {
        type: { summary: 'CSSProperties' },
        category: 'Advanced'
      }
    }
  }
} satisfies Meta<typeof Box>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Default Box'
  }
}

export const WithPadding: Story = {
  args: {
    children: 'Box with padding',
    p: '400',
    shadow: '600'
  }
}

/**
 * This is example for Box polymorphism.
 * You can render Box as different HTML elements or components using the "as" prop.
 */
export const Polymorphic: Story = {
  tags: ['!dev'],
  render: () => (
    <Box display="flex" flexDirection="column" gap="400">
      <Box as="section" p="400" bg="backgroundDefaultSecondary" rounded="200">
        <Box as="h3" style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
          Section Element
        </Box>
        <Box as="p" style={{ margin: '8px 0 0', fontSize: '14px' }}>
          Box rendered as semantic section
        </Box>
      </Box>

      <Box as="article" p="400" bg="backgroundDefaultSecondary" rounded="200">
        <Box as="h3" style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
          Article Element
        </Box>
        <Box as="p" style={{ margin: '8px 0 0', fontSize: '14px' }}>
          Box rendered as semantic article
        </Box>
      </Box>

      <Box
        as="button"
        p="400"
        bg="backgroundDefaultSecondary"
        rounded="200"
        border="border"
        borderColor="borderDefaultDefault"
        style={{ cursor: 'pointer' }}
        onClick={() => alert('Clicked!')}
      >
        Button Element
      </Box>
    </Box>
  )
}

/**
 * This example demonstrates the style priority in Box.
 * Sprinkles (className) vs StyleProps (inline style) vs style prop (inline style)
 * When the same property is set, inline styles (StyleProps & style prop) override Sprinkles.
 */
export const StylePriority: Story = {
  tags: ['!dev'], // Docs-only: hidden from sidebar, visible in documentation
  render: () => (
    <Box display="flex" flexDirection="column" gap="400">
      <Box>
        <Box as="h3" style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 600 }}>
          1. Sprinkles only (className)
        </Box>
        <Box p="400" bg="backgroundTagBlue" rounded="200">
          p=&quot;400&quot;, bg=&quot;backgroundTagBlue&quot;, rounded=&quot;200&quot;
        </Box>
      </Box>

      <Box>
        <Box as="h3" style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 600 }}>
          2. Sprinkles + StyleProps (inline style opacity: 0.3, width: 250px)
        </Box>
        <Box p="400" bg="backgroundTagGreen" rounded="200" width="250px" opacity={0.3}>
          width & opacity are StyleProps (added to inline style)
        </Box>
      </Box>

      <Box>
        <Box as="h3" style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 600 }}>
          3. Priority test: style prop overrides Sprinkles
        </Box>
        <Box
          p="400"
          bg="backgroundTagGray"
          rounded="200"
          style={{
            backgroundColor: 'var(--background-tag-red)',
            padding: '24px'
          }}
        >
          Sprinkles: bg=gray, p=400 → style prop: red background, 24px padding wins! ✅
        </Box>
      </Box>

      <Box>
        <Box as="h3" style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 600 }}>
          4. Priority test: style prop overrides StyleProps
        </Box>
        <Box
          width="200px"
          opacity={0.5}
          style={{
            width: '300px',
            opacity: 1
          }}
        >
          <Box p="300" bg="backgroundTagBlue" rounded="100">
            StyleProps: 200px, 0.5 → style prop: 300px, 1.0 wins! ✅
          </Box>
        </Box>
      </Box>

      <Box>
        <Box as="h3" style={{ margin: '0 0 8px', fontSize: '14px', fontWeight: 600 }}>
          5. All combined (mixing different properties)
        </Box>
        <Box
          p="400"
          bg="backgroundDefaultSecondary"
          rounded="200"
          width="280px"
          opacity={0.95}
          style={{
            border: '2px dashed var(--border-default-default)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          Sprinkles: p, bg, rounded / StyleProps: width, opacity / style: border, shadow
        </Box>
      </Box>
    </Box>
  )
}

/**
 * This is example for using Box as a child of a Flex container.
 * For layout needs, use dedicated components like Stack, Inline, or Center.
 */
export const AsFlexChild: Story = {
  tags: ['!dev'], // Docs-only: hidden from sidebar, visible in documentation
  render: () => (
    <Box>
      <Box
        as="p"
        style={{
          margin: '0 0 16px',
          fontSize: '14px',
          color: 'var(--colors-text-default-secondary)'
        }}
      >
        💡 If you need a Flex layout, it is recommended to use <strong>Stack</strong> or{' '}
        <strong>Inline</strong> components.
      </Box>

      <Box display="flex" gap="300" p="400" bg="backgroundDefaultSecondary" rounded="200">
        <Box p="300" bg="backgroundTagBlue" rounded="100" style={{ flex: '0 0 auto' }}>
          Fixed
        </Box>
        <Box p="300" bg="backgroundTagGreen" rounded="100" style={{ flex: '1 1 auto' }}>
          Flexible
        </Box>
        <Box p="300" bg="backgroundTagGray" rounded="100" style={{ flex: '0 0 auto' }}>
          Fixed
        </Box>
      </Box>
    </Box>
  )
}
