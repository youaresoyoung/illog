import { Tag } from '../Tag'
import { TagType } from '../Tag/types'

type Props = {
  tags: TagType[]
  removeFromTask: (id: string) => void
}

export const SelectedTags = ({ tags, removeFromTask }: Props) => (
  <>
    {tags.map((tag) => (
      <Tag key={tag.id} tag={tag} removeFromTask={() => removeFromTask(tag.id)} />
    ))}
  </>
)
