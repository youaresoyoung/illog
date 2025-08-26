import { useMemo, useRef } from 'react'
import { TagItem } from './TagItem'
import { useTagStore } from '../../stores/useTagStore'
import { Color } from 'services/app/src/types'

export const TagSelector = () => {
  const { tags, createTag } = useTagStore()

  const inputRef = useRef<HTMLInputElement>(null)
  const colorSelect = useRef<HTMLSelectElement>(null)

  const filteredTags = useMemo(() => {
    return tags
  }, [tags])

  const handleAddTag = async () => {
    const name = inputRef.current?.value ?? ''
    const color = colorSelect.current?.value as Color

    createTag({ name, color })
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
          <TagItem key={tag.id} {...tag} />
        ))}
      </ul>
      <select name="color" id="color" ref={colorSelect}>
        {['blue', 'green', 'yellow', 'purple', 'red', 'gray'].map((color) => (
          <option key={color}>{color}</option>
        ))}
      </select>
      <button onClick={handleAddTag}>Add tag</button>
    </>
  )
}
