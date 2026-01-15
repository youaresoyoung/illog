import { useMemo } from 'react'
import {
  Inline,
  Stack,
  Tag,
  TagSelector,
  Divider,
  useTagSelectorContext,
  type TagType,
  type OmittedTag
} from '@illog/ui'
import {
  useAllTags,
  useCreateTag,
  useUpdateTag,
  useDeleteTag
} from '../../hooks/queries/useTagQueries'
import { useAddTagToTask, useRemoveTagFromTask } from '../../hooks/queries/useTaskQueries'
import type { TaskWithTags, CreateTagRequest, UpdateTagRequest } from '../../../../shared/types'

const TagsTrigger = ({ selectedTags }: { selectedTags: TagType[] }) => {
  const { removeTag } = useTagSelectorContext()

  const handleRemoveTag = (tagId: string) => {
    void removeTag(tagId)
  }

  return (
    <Stack minW="0" overflow="hidden">
      {selectedTags.length > 0 ? (
        <Inline as="ul" role="list" gap="200" w="100%" wrap="wrap">
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

export const TagSection = ({ task }: { task: TaskWithTags }) => {
  const { data: tags = [] } = useAllTags()
  const { mutateAsync: createTag } = useCreateTag()
  const { mutateAsync: updateTag } = useUpdateTag()
  const { mutateAsync: deleteTag } = useDeleteTag()
  const { mutateAsync: addTag } = useAddTagToTask()
  const { mutateAsync: removeTag } = useRemoveTagFromTask()

  const tagList = useMemo(() => tags as TagType[], [tags])

  const selectedTags = useMemo(
    () =>
      task.tags
        .map((tag) => tags.find((it) => it.id === tag.id))
        .filter((tag): tag is TagType => tag !== undefined),
    [task.tags, tags]
  )

  const handleAddTag = async (tagId: string) => {
    await addTag({ taskId: task.id, tagId })
  }

  const handleRemoveTag = async (tagId: string) => {
    await removeTag({ taskId: task.id, tagId })
  }

  const handleCreateTag = async (data: Partial<OmittedTag>) => {
    if (!data.name) throw new Error('Tag name is required')
    const newTag = await createTag({
      name: data.name,
      color: data.color
    } as CreateTagRequest)
    return newTag.id
  }

  const handleUpdateTag = async (tagId: string, data: Partial<OmittedTag>) => {
    await updateTag({ id: tagId, data: data as UpdateTagRequest })
  }

  const handleDeleteTag = async (tagId: string) => {
    await deleteTag(tagId)
  }

  return (
    <TagSelector.Root
      tags={tagList}
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
  )
}
