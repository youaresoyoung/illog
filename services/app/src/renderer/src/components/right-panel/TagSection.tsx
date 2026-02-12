import { Inline, Text } from '@illog/ui'
import { TaskWithTags } from '../../types'
import { MAX_TAG_LENGTH } from 'services/app/src/shared/const'

type Props = {
  task: TaskWithTags
}

export const TagSection = ({ task }: Props) => {
  return (
    <>
      <Inline>
        <Text textStyle="bodyStrong">Tags</Text>
        <Text textStyle="captionStrong" color="textDefaultTertiary" px="300" py="100">
          {task.tags.length}/{MAX_TAG_LENGTH} used
        </Text>
      </Inline>
      <TagSection task={task} />
    </>
  )
}
