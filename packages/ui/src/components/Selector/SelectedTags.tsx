import { memo } from 'react'
import { Tag } from '../Tag'
import { TagType } from '../Tag/types'

type Props = {
  tags: TagType[]
  removeFromTask: (id: string) => void
}

const SelectedTagsBase = ({ tags, removeFromTask }: Props) => (
  <>
    {tags.map((tag) => (
      <Tag key={tag.id} tag={tag} removeFromTask={() => removeFromTask(tag.id)} />
    ))}
  </>
)

export const SelectedTags = memo(SelectedTagsBase)
SelectedTags.displayName = 'SelectedTags'
