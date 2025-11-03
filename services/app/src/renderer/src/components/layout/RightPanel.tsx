import { useAutoSaveNote } from '../../hooks/useAutoSaveNote'
import { useReflection, useReflectionStream, useTask, useUpdateTask } from '../../hooks/queries'
import {
  Button,
  Dialog,
  Inline,
  Input,
  Stack,
  Text,
  TimePicker,
  useAutoSaveInput,
  useDialog
} from '@illog/ui'
import { TagSection } from '../tag/TagSection'
import { MAX_TAG_LENGTH } from '../../../../types'

type Props = {
  taskId: string
}

export const RightPanel = ({ taskId }: Props) => {
  const { data: task } = useTask(taskId)
  const { data: existingReflection } = useReflection(taskId)
  const { generateReflection, isStreaming, streamedContent, resetStream } = useReflectionStream()
  const [note, handleChange] = useAutoSaveNote(taskId)
  const { mutate: updateTask } = useUpdateTask()

  const [isDialogOpen, openDialog, closeDialog] = useDialog({ initialOpen: false })
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

  const displayReflectionText =
    isStreaming || streamedContent ? streamedContent : existingReflection?.content || ''

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

  const startReflectionGeneration = async () => {
    if (!note?.content) return

    resetStream()
    await generateReflection(taskId, note.content)
  }

  const handleReflectNote = async () => {
    if (existingReflection) {
      return openDialog()
    }

    startReflectionGeneration()
  }

  const handleConfirmClick = () => {
    closeDialog()
    startReflectionGeneration()
  }

  if (!task) {
    // TODO: better error handling UX
    return <div>Loading...</div>
  }

  return (
    <>
      <Stack
        position="fixed"
        top="0"
        bottom="0"
        right="0"
        width="720px"
        // height="100vh"
        overflow="scroll"
        borderLeft="border"
        borderLeftColor="borderDefaultDefault"
        borderLeftStyle="solid"
        p="300"
        backgroundColor="backgroundDefaultDefault"
        gap="1200"
      >
        <Stack>
          <Input value={title} onChange={handleTitleChange} />
          <Text textStyle="caption" mt="100">
            Last edited at {new Date(task?.updated_at).toLocaleString()}
          </Text>
          {/* <Input value={description} onChange={handleDescriptionChange} /> */}
        </Stack>
        <Inline>
          <Stack gap="400" flex="1">
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
        </Inline>

        <Stack>
          <textarea
            placeholder="Type your notes here..."
            style={{ width: '100%', height: '400px' }}
            value={note?.content || ''}
            onChange={handleChange}
          />
        </Stack>
        <Stack>
          <Button
            variant="primary"
            size="md"
            onClick={handleReflectNote}
            isDisabled={isStreaming || !note?.content}
          >
            {isStreaming ? 'Generating...' : 'AI Reflection'}
          </Button>
          <div>
            <h4>AI Reflection</h4>
            <Stack
              as="p"
              height="320px"
              bg="backgroundDefaultSecondary"
              p="200"
              mt="400"
              overflow="auto"
            >
              <p>{displayReflectionText}</p>
            </Stack>
          </div>
        </Stack>
      </Stack>

      <Dialog isOpen={isDialogOpen} onClose={closeDialog}>
        <Dialog.Title>Do you want to delete the previous summary?</Dialog.Title>
        <Dialog.Description>
          To generate a new summary, the existing summary will be deleted.
        </Dialog.Description>
        <Dialog.Footer>
          <Button variant="secondary" isFullWidth onClick={closeDialog}>
            Cancel
          </Button>
          <Button variant="primary" isFullWidth onClick={handleConfirmClick}>
            Confirm
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}
