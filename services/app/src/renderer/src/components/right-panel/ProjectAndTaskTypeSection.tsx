import { Inline } from '@illog/ui'
import { ProjectSection } from '../project/ProjectSection'
import { TaskTypeSection } from '../task-type/TaskTypeSection'
import { TaskWithTags } from '../../types'

export const ProjectAndTaskTypeSection = ({ task }: { task: TaskWithTags }) => {
  return (
    <Inline gap="200">
      <ProjectSection task={task} />
      <TaskTypeSection task={task} />
    </Inline>
  )
}
