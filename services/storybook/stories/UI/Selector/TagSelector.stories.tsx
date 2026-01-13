import { useState, useCallback } from 'react'
import {
  TagSelector,
  Tag,
  Divider,
  Stack,
  Inline,
  useTagSelectorContext,
  type TagType,
  type OmittedTag
} from '@illog/ui'
import { Meta, StoryObj } from '@storybook/react-vite'

const mockTags: TagType[] = [
  {
    id: '1',
    name: 'meeting',
    color: 'blue',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: '2',
    name: 'study',
    color: 'purple',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: '3',
    name: 'poc',
    color: 'green',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: '4',
    name: 'development',
    color: 'red',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  },
  {
    id: '5',
    name: 'code review',
    color: 'yellow',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null
  }
]

const TagsTrigger = ({ selectedTags }: { selectedTags: TagType[] }) => {
  const { removeTag } = useTagSelectorContext()

  const handleRemoveTag = (tagId: string) => {
    void removeTag(tagId)
  }

  return (
    <Stack minW="0" overflow="hidden">
      {selectedTags.length > 0 ? (
        <Inline as="ul" role="list" gap="200" wrap="wrap">
          {selectedTags.map((tag) => (
            <Inline minW="0" maxW="100%" key={tag.id}>
              <Tag
                tag={{ id: tag.id, name: tag.name, color: tag.color }}
                removeFromTask={() => handleRemoveTag(tag.id)}
              />
            </Inline>
          ))}
        </Inline>
      ) : (
        <Tag
          tag={{ id: 'Add Tag', name: 'Add Tag', color: 'gray' }}
          addTagButtonVariant="default"
        />
      )}
    </Stack>
  )
}

const TagSelectorDemo = ({
  initialTags = mockTags,
  initialSelectedTags = []
}: {
  initialTags?: TagType[]
  initialSelectedTags?: TagType[]
}) => {
  const [tags, setTags] = useState<TagType[]>(initialTags)
  const [selectedTags, setSelectedTags] = useState<TagType[]>(initialSelectedTags)

  const handleAddTag = useCallback(
    async (tagId: string) => {
      const tag = tags.find((t) => t.id === tagId)
      if (tag && !selectedTags.some((t) => t.id === tagId)) {
        setSelectedTags((prev) => [...prev, tag])
      }
    },
    [tags, selectedTags]
  )

  const handleRemoveTag = useCallback(async (tagId: string) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tagId))
  }, [])

  const handleCreateTag = useCallback(async (data: Partial<OmittedTag>) => {
    const newTag: TagType = {
      id: `new-${Date.now()}`,
      name: data.name || 'New Tag',
      color: data.color || 'gray',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    }
    setTags((prev) => [...prev, newTag])
    return newTag.id
  }, [])

  const handleDeleteTag = useCallback(async (tagId: string) => {
    setTags((prev) => prev.filter((t) => t.id !== tagId))
    setSelectedTags((prev) => prev.filter((t) => t.id !== tagId))
  }, [])

  const handleUpdateTag = useCallback(async (tagId: string, data: Partial<OmittedTag>) => {
    setTags((prev) =>
      prev.map((t) => (t.id === tagId ? { ...t, ...data, updatedAt: new Date() } : t))
    )
    setSelectedTags((prev) =>
      prev.map((t) => (t.id === tagId ? { ...t, ...data, updatedAt: new Date() } : t))
    )
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <TagSelector.Root
        tags={tags}
        selectedTags={selectedTags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
        onCreateTag={handleCreateTag}
        onDeleteTag={handleDeleteTag}
        onUpdateTag={handleUpdateTag}
      >
        <TagSelector.Trigger asChild>
          <TagsTrigger selectedTags={selectedTags} />
        </TagSelector.Trigger>

        <TagSelector.Content>
          <TagSelector.Search placeholder="Search tags..." />
          <Divider />
          <TagSelector.List />
        </TagSelector.Content>
      </TagSelector.Root>
    </div>
  )
}

const meta = {
  title: 'UI/Selector/TagSelector',
  component: TagSelectorDemo,
  parameters: {
    layout: 'centered'
  }
} satisfies Meta<typeof TagSelectorDemo>

export default meta
type Story = StoryObj<typeof TagSelectorDemo>

export const Default: Story = {
  args: {
    initialTags: mockTags,
    initialSelectedTags: []
  }
}

export const WithSelectedTags: Story = {
  args: {
    initialTags: mockTags,
    initialSelectedTags: [mockTags[0], mockTags[2]]
  }
}

export const EmptyList: Story = {
  args: {
    initialTags: [],
    initialSelectedTags: []
  }
}

export const ManySelectedTags: Story = {
  args: {
    initialTags: mockTags,
    initialSelectedTags: mockTags.slice(0, 4)
  }
}
