import { BasicSelector } from '@illog/ui'
import { TASK_STATUSES, TaskStatus, TaskWithTags } from '../../types'
import { useUpdateTask } from '../../hooks/queries'

type Props = {
  task: TaskWithTags
}

export const Status = ({ task }: Props) => {
  const { mutate: updateTask } = useUpdateTask()

  const handleStatusChange = (value: string) => {
    updateTask({ id: task.id, data: { status: value as TaskStatus } })
  }

  return (
    <BasicSelector.Root value={task.status} onValueChange={handleStatusChange}>
      <BasicSelector.Trigger>{task.status}</BasicSelector.Trigger>
      <BasicSelector.Content>
        <BasicSelector.Viewport>
          {TASK_STATUSES.map((status) => (
            <BasicSelector.Item key={status} value={status}>
              {status}
            </BasicSelector.Item>
          ))}
        </BasicSelector.Viewport>
      </BasicSelector.Content>
    </BasicSelector.Root>
  )
}
