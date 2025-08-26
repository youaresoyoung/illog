import { useRef } from 'react'
import { useTagStore } from '../../stores/useTagStore'
import { Color } from 'services/app/src/types'

type Props = {
  id: string
  name: string
}

export const TagEditor = ({ id, name }: Props) => {
  const { deleteTag, updateTag } = useTagStore()

  const colorSelect = useRef<HTMLSelectElement>(null)

  const handleChangeColor = () => {
    const color = colorSelect.current?.value as Color
    updateTag(id, { color })
  }

  return (
    <div>
      <input value={name} />
      <button onClick={() => deleteTag(id)}>delete</button>
      <select name="color" id="color" ref={colorSelect} onChange={handleChangeColor}>
        {['blue', 'green', 'yellow', 'purple', 'red', 'gray'].map((color) => (
          <option key={color}>{color}</option>
        ))}
      </select>
    </div>
  )
}
