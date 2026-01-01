import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Color } from '../../types'
import { useDeleteTag, useUpdateTag } from '../../hooks/queries'

type Props = {
  id: string
  name: string
}

export const TagEditor = ({ id, name }: Props) => {
  const { mutateAsync: deleteTag } = useDeleteTag()
  const { mutateAsync: updateTag } = useUpdateTag()

  const [tagName, setTagName] = useState(name)
  const inputSelectRef = useRef<HTMLInputElement>(null)
  const colorSelectRef = useRef<HTMLSelectElement>(null)

  const handleChangeColor = () => {
    const color = colorSelectRef.current?.value as Color
    updateTag({ id, contents: { color } })
  }

  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    setTagName(e.currentTarget.value)
  }

  useEffect(() => {
    const onClickOutSide = (e: MouseEvent) => {
      if (e.currentTarget === inputSelectRef.current) return
      if (name !== inputSelectRef.current?.value) {
        updateTag({ id, contents: { name: inputSelectRef.current?.value } })
      }
    }

    document.addEventListener('mousedown', onClickOutSide)

    return () => document.removeEventListener('mousedown', onClickOutSide)
  }, [id, name, updateTag])

  return (
    <div>
      <input value={tagName} ref={inputSelectRef} onChange={handleChangeName} />
      <button onClick={() => deleteTag(id)}>delete</button>
      <select name="color" id="color" ref={colorSelectRef} onChange={handleChangeColor}>
        {['blue', 'green', 'yellow', 'purple', 'red', 'gray'].map((color) => (
          <option key={color}>{color}</option>
        ))}
      </select>
    </div>
  )
}
