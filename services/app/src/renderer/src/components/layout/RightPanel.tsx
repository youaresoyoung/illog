import { useTask, useUpdateTask } from '../../hooks/queries'
import { Inline, Input, Stack, Text, TimePicker, useAutoSaveInput } from '@illog/ui'
import { TagSection } from '../tag/TagSection'
import { MAX_TAG_LENGTH, TaskNote } from '../../../../types'

import { useTaskNote } from '../../hooks/queries/useNoteQueries'
import { TextareaSection } from '../right-panel/TextareaSection'
import { ReflectionSection } from '../right-panel/ReflectionSection'

type Props = {
  taskId: string
}

export const RightPanel = ({ taskId }: Props) => {
  const { data: task } = useTask(taskId)

  const { data: note } = useTaskNote(taskId) as { data: TaskNote | null }
  const { mutate: updateTask } = useUpdateTask()

  const [title, , handleTitleChange] = useAutoSaveInput(
    task?.title || '',
    (value) => {
      if (task) updateTask({ id: task.id, contents: { title: value } })
    },
    1000
  )
  const [description, , handleDescriptionChange] = useAutoSaveInput(
    task?.description || '',
    (value) => {
      if (task) updateTask({ id: task.id, contents: { description: value } })
    },
    1000
  )

  const handleDateTimeChange = (value: { start: string | null; end: string | null }) => {
    if (!task) return

    updateTask({
      id: task.id,
      contents: {
        timer_start: value.start ?? undefined,
        timer_end: value.end ?? undefined
      }
    })
  }

  if (!task) {
    // TODO: better error handling UX
    return <div>Loading...</div>
  }

  return (
    <>
      <Stack
        width="720px"
        height="100vh"
        overflow="scroll"
        borderLeft="border"
        borderLeftColor="borderDefaultDefault"
        borderLeftStyle="solid"
        px="600"
        py="1200"
        backgroundColor="backgroundDefaultDefault"
        gap="1200"
      >
        <Stack>
          <Input value={title} onChange={handleTitleChange} placeholder="Log title..." />
          <Input
            value={description}
            onChange={handleDescriptionChange}
            placeholder="description..."
          />
          <Text textStyle="caption" mt="100">
            Last edited at {new Date(task?.updated_at).toLocaleString()}
          </Text>
        </Stack>
        <Inline gap="1200">
          <Stack gap="400" flex="1" minWidth="0" overflow="hidden">
            <Inline>
              <Text textStyle="bodyStrong">Tags</Text>
              <Text textStyle="captionStrong" color="textDefaultTertiary" px="300" py="100">
                {task.tags.length}/{MAX_TAG_LENGTH} used
              </Text>
            </Inline>
            <TagSection task={task} />
          </Stack>
          <Stack flex="1" gap="400">
            <Text textStyle="bodyStrong">Time</Text>
            <Stack>
              <TimePicker
                value={{ start: task.timer_start ?? null, end: task.timer_end ?? null }}
                onChange={handleDateTimeChange}
              >
                <TimePicker.Range>
                  <TimePicker.Input field="start" placeholder="Start time" />
                  <TimePicker.Separator />
                  <TimePicker.Input field="end" placeholder="End time" />
                </TimePicker.Range>
                <TimePicker.Summary showTime={false} />
              </TimePicker>
            </Stack>
          </Stack>
        </Inline>

        <Stack gap="200">
          <TextareaSection taskId={task.id} note={note} />
        </Stack>
        <ReflectionSection taskId={task.id} noteContent={note?.content} />
      </Stack>
    </>
  )
}
