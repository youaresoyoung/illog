import { TaskWithTags } from 'services/app/src/types'
import { useTaskActions } from '../../stores/useTaskStore'
import { TagSection } from '../tag/TagSection'
import { Card, Input, Text, useAutoSaveInput } from '@illog/ui'

type Props = {
  task: TaskWithTags
  handleDeleteTask: (id: string) => void
}

export const TaskCard = ({ task, handleDeleteTask }: Props) => {
  const { openTaskNote, updateTask } = useTaskActions()

  const [title, , handleChange] = useAutoSaveInput(
    task.title,
    (value) => updateTask(task.id, { ...task, title: value }),
    1000
  )

  const handleClickCard = () => {
    openTaskNote(task.id)
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
