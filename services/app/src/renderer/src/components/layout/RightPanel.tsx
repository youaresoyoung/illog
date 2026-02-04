import { useEffect, useRef } from 'react'
import { useTaskById, useUpdateTask } from '../../hooks/queries'
import { Inline, Input, Stack, Text, useAutoSaveInput } from '@illog/ui'
import { TagSection } from '../tag/TagSection'
import type { TaskNote } from '../../../../shared/types'

import { useTaskNote } from '../../hooks/queries/useNoteQueries'
import { NoteEditorSection } from '../right-panel/NoteEditorSection'
import { ReflectionSection } from '../right-panel/ReflectionSection'
import { ProjectAndTaskTypeSection } from '../right-panel/ProjectAndTaskTypeSection'
import { TimeSection } from '../right-panel/TimeSection'

type Props = {
  taskId: string
}

export const RightPanel = ({ taskId }: Props) => {
  const { data: task } = useTaskById(taskId)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const { data: note } = useTaskNote(taskId) as { data: TaskNote | null }
  const { mutate: updateTask } = useUpdateTask()

  const [title, , handleTitleChange] = useAutoSaveInput(
    task?.title || '',
    (value) => {
      if (task) updateTask({ id: task.id, data: { title: value } })
    },
    1000
  )
  const [description, , handleDescriptionChange] = useAutoSaveInput(
    task?.description || '',
    (value) => {
      if (task) updateTask({ id: task.id, data: { description: value } })
    },
    1000
  )

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [taskId])

  if (!task) {
    // TODO: better error handling UX
    return <div>Loading...</div>
  }

  return (
    <>
      <Stack
        ref={scrollContainerRef}
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
          <ProjectAndTaskTypeSection task={task} />
          <Input value={title} onChange={handleTitleChange} placeholder="Log title..." />
          <Input
            value={description}
            onChange={handleDescriptionChange}
            placeholder="description..."
          />
          <Text textStyle="caption" mt="100">
            Last edited at {task.updatedAt ? new Date(task.updatedAt).toLocaleString() : 'N/A'}
          </Text>
        </Stack>
        <Inline gap="1200">
          <Stack gap="400" flex="1" minWidth="0" overflow="hidden">
            <TagSection task={task} />
          </Stack>
          <Stack flex="1" gap="400">
            <TimeSection task={task} />
          </Stack>
        </Inline>

        <Stack gap="200">
          <NoteEditorSection taskId={task.id} note={note} />
        </Stack>
        <ReflectionSection taskId={task.id} noteContent={note?.content ?? undefined} />
      </Stack>
    </>
  )
}
