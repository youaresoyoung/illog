import { TagSection } from '../tag/TagSection'
import { Card, Input, useAutoSaveInput } from '@illog/ui'
import { useUpdateTask } from '../../hooks/queries/useTaskQueries'
import { TaskWithTags } from '../../types'

type Props = {
  task: TaskWithTags
  handleDeleteTask?: (id: string) => void
  handleOpenNote: (id: string) => void
}

export const TaskCard = ({ task, handleOpenNote }: Props) => {
  const { mutate: updateTask } = useUpdateTask()

  const [title, , handleChangeTitle] = useAutoSaveInput(
    task.title,
    (value) => updateTask({ id: task.id, contents: { title: value } }),
    1000
  )
  const [description, , handleChangeDescription] = useAutoSaveInput(
    task.description,
    (value) => updateTask({ id: task.id, contents: { description: value } }),
    1000
  )

  const handleClickCard = () => {
    handleOpenNote(task.id)
  }

  return (
    <Card onClick={handleClickCard} maxWidth="100%">
      <div>
        <Input
          style={{ paddingLeft: 0 }}
          type="text"
          name="title"
          placeholder="Log title..."
          value={title}
          onChange={handleChangeTitle}
        />
        <Input
          style={{ paddingLeft: 0 }}
          type="text"
          name="description"
          placeholder="description..."
          value={description}
          onChange={handleChangeDescription}
        />
      </div>
      {/* <button onClick={() => handleDeleteTask(task.id)}>Delete</button> */}

      <TagSection task={task} />
    </Card>
  )
}
