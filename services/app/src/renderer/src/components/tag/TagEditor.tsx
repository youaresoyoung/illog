import { useTagStore } from '../../stores/useTagStore'

type Props = {
  id: string
  name: string
}

export const TagEditor = ({ id, name }: Props) => {
  const { deleteTag } = useTagStore()

  return (
    <div>
      <input value={name} />
      <button onClick={() => deleteTag(id)}>delete</button>
    </div>
  )
}
