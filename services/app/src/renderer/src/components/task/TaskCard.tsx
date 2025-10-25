import { TaskWithTags } from 'services/app/src/types'
import { TagSection } from '../tag/TagSection'
import { Card, Input, Text, useAutoSaveInput } from '@illog/ui'
import { useUpdateTask } from '../../hooks/queries/useTaskQueries'

type Props = {
  task: TaskWithTags
  handleDeleteTask?: (id: string) => void
  handleOpenNote: (id: string) => void
}

export const TaskCard = ({ task, handleOpenNote }: Props) => {
  const { mutate: updateTask } = useUpdateTask()

  const [title, , handleChange] = useAutoSaveInput(
    task.title,
    (value) => updateTask({ id: task.id, contents: { title: value } }),
    1000
  )

  const handleClickCard = () => {
    handleOpenNote(task.id)
  }

  return (
    <Card onClick={handleClickCard}>
      <div>
        <Input
          style={{ paddingLeft: 0 }}
          type="text"
          name="title"
          placeholder="Log title..."
          value={title}
          onChange={handleChange}
        />
        <Text as="p" textStyle="bodySmall" color="textDefaultSecondary">
          Description
        </Text>
      </div>
      {/* <button onClick={() => handleDeleteTask(task.id)}>Delete</button> */}

      <TagSection task={task} />
    </Card>
  )
}
