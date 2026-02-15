import { Stack, Text } from '@illog/ui'
import { TaskWithTags } from '../../types'
import { TaskCard } from '../task/TaskCard'
import { useUIStore } from '../../stores/useUIStore'

type Props = {
  tasks: TaskWithTags[]
}

export const ProjectTaskCardList = ({ tasks }: Props) => {
  const openTaskNote = useUIStore((s) => s.openTaskNote)

  return (
    <Stack gap="400">
      <Text textStyle="bodyStrong" color="textDefaultDefault">
        Tasks
      </Text>
      <Stack gap="200">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} handleOpenNote={openTaskNote} />
        ))}
      </Stack>
    </Stack>
  )
}
