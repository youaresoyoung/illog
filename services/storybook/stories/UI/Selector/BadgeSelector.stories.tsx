import { useState, useCallback } from 'react'
import {
  BadgeSelector,
  Badge,
  Divider,
  Stack,
  useBadgeSelectorContext,
  type BadgeItem,
  type OmittedBadgeItem
} from '@illog/ui'
import { Meta, StoryObj } from '@storybook/react-vite'

const mockItems: BadgeItem[] = [
  {
    id: '1',
    name: 'Website Redesign',
    color: 'blue',
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  },
  {
    id: '2',
    name: 'Mobile App',
    color: 'green',
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  },
  {
    id: '3',
    name: 'API Integration',
    color: 'purple',
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  },
  {
    id: '4',
    name: 'Bug Fixes',
    color: 'red',
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  },
  {
    id: '5',
    name: 'Documentation',
    color: 'yellow',
    createdAt: new Date(),
    updatedAt: null,
    deletedAt: null
  }
]

const BadgeTrigger = ({ item }: { item: BadgeItem | null }) => {
  const { isOpen } = useBadgeSelectorContext()

  return (
    <Stack minW="0" overflow="hidden">
      {item ? (
        <Badge item={item} isOpenedSelector={isOpen} />
      ) : (
        <Badge
          item={{ name: 'Add Item', color: 'gray' }}
          isOpenedSelector={isOpen}
          addButtonVariant={'default'}
        />
      )}
    </Stack>
  )
}

const BadgeSelectorDemo = ({
  initialItems = mockItems,
  initialSelectedItem = null
}: {
  initialItems?: BadgeItem[]
  initialSelectedItem?: BadgeItem | null
}) => {
  const [items, setItems] = useState<BadgeItem[]>(initialItems)
  const [selectedItem, setSelectedItem] = useState<BadgeItem | null>(initialSelectedItem)

  const handleSelectItem = useCallback(
    async (itemId: string) => {
      const item = items.find((i) => i.id === itemId)
      if (item) {
        setSelectedItem(item)
      }
    },
    [items]
  )

  const handleClearItem = useCallback(async () => {
    setSelectedItem(null)
  }, [])

  const handleCreateItem = useCallback(async (data: Partial<OmittedBadgeItem>) => {
    const newItem: BadgeItem = {
      id: `new-${Date.now()}`,
      name: data.name || 'New Item',
      color: data.color || 'gray',
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null
    }
    setItems((prev) => [...prev, newItem])
    return newItem.id
  }, [])

  const handleDeleteItem = useCallback(async (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId))
  }, [])

  const handleUpdateItem = useCallback(async (itemId: string, data: Partial<OmittedBadgeItem>) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, ...data, updatedAt: new Date() } : i))
    )
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: '300px' }}>
      <BadgeSelector.Root
        items={items}
        selectedItem={selectedItem}
        onSelectItem={handleSelectItem}
        onClearItem={handleClearItem}
        onCreateItem={handleCreateItem}
        onDeleteItem={handleDeleteItem}
        onUpdateItem={handleUpdateItem}
      >
        <BadgeSelector.Trigger asChild>
          <BadgeTrigger item={selectedItem} />
        </BadgeSelector.Trigger>

        <BadgeSelector.Content>
          <BadgeSelector.Search placeholder="Search..." />
          <Divider />
          <BadgeSelector.List />
        </BadgeSelector.Content>
      </BadgeSelector.Root>
    </div>
  )
}

const meta = {
  title: 'UI/Selector/BadgeSelector',
  component: BadgeSelectorDemo,
  parameters: {
    layout: 'centered'
  },
  argTypes: {
    initialSelectedItem: {
      control: 'select',
      options: ['none', ...mockItems.map((i) => i.name)],
      mapping: {
        none: null,
        ...Object.fromEntries(mockItems.map((i) => [i.name, i]))
      }
    }
  }
} satisfies Meta<typeof BadgeSelectorDemo>

export default meta
type Story = StoryObj<typeof BadgeSelectorDemo>

export const Default: Story = {
  args: {
    initialItems: mockItems,
    initialSelectedItem: null
  }
}

export const WithSelectedItem: Story = {
  args: {
    initialItems: mockItems,
    initialSelectedItem: mockItems[0]
  }
}

export const EmptyList: Story = {
  args: {
    initialItems: [],
    initialSelectedItem: null
  }
}

export const SingleItem: Story = {
  args: {
    initialItems: [mockItems[0]],
    initialSelectedItem: null
  }
}
