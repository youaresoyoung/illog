import { useMemo, useRef } from 'react'
import { TagItem } from './TagItem'
import { useTagStore } from '../../stores/useTagStore'
import { TaskWithTags } from 'services/app/src/types'

export const TagSelector = ({ task }: { task: TaskWithTags }) => {
  const { tags, createTag } = useTagStore()

  const inputRef = useRef<HTMLInputElement>(null)

  const filteredTags = useMemo(() => {
    return tags
  }, [tags])

  const handleAddTag = async () => {
    const name = inputRef.current?.value ?? ''

    createTag({ name })
  }

  return (
    <>
      <input
        ref={inputRef}
        type="text"
        name="tagName"
        placeholder="Search or create tag"
        onChange={() => {}}
      />
      <ul>
        {filteredTags.map((tag) => (
          <TagItem key={tag.id} {...tag} taskId={task.id} />
        ))}
      </ul>
      <button onClick={handleAddTag}>Add tag</button>
    </>
  )
}
