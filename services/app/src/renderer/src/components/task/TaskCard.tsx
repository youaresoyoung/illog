import { TagSection } from '../tag/TagSection'
import { ProjectSection } from '../project/ProjectSection'
import { TaskTypeSection } from '../task-type/TaskTypeSection'
import {
  Button,
  Card,
  ContextMenu,
  Dialog,
  Inline,
  Input,
  Stack,
  useAutoSaveInput,
  useDialog
} from '@illog/ui'
import { useDeleteTask, useUpdateTask } from '../../hooks/queries/useTaskQueries'
import type { TaskWithTags } from '../../../../shared/types'
import type { MouseEvent } from 'react'
import { Status } from '../status/Status'
import { Time } from '../time/Time'

const INTERACTIVE_SELECTORS =
  'a, input, select, textarea, button, label, ' +
  '[role="combobox"], [role="listbox"], [role="menu"], [role="option"], ' +
  '[data-interactive]'

type Props = {
  task: TaskWithTags
  handleOpenNote: (id: string) => void
}

export const TaskCard = ({ task, handleOpenNote }: Props) => {
  const { mutate: updateTask } = useUpdateTask()
  const { mutate: deleteTask } = useDeleteTask()
  const [isDeleteDialogOpen, openDeleteDialog, closeDeleteDialog] = useDialog({})

  const [title, , handleChangeTitle] = useAutoSaveInput(
    task.title,
    (value) => updateTask({ id: task.id, data: { title: value } }),
    1000
  )
  const [description, , handleChangeDescription] = useAutoSaveInput(
    task.description ?? '',
    (value) => updateTask({ id: task.id, data: { description: value } }),
    1000
  )

  const handleClickCard = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.closest(INTERACTIVE_SELECTORS)) return
    handleOpenNote(task.id)
  }

  const handleConfirmDelete = () => {
    deleteTask(task.id)
    closeDeleteDialog()
  }

  return (
    <>
      <Card onClick={handleClickCard} maxWidth="100%">
        <ContextMenu.Root>
          <ContextMenu.Trigger>
            <Stack gap="400">
              <Inline gap="200" justify="space-between">
                <Inline maxWidth={120}>
                  <Status task={task} />
                </Inline>
                <Time task={task} />
              </Inline>
              <Inline gap="200">
                <ProjectSection task={task} />
                <TaskTypeSection task={task} />
              </Inline>
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
              <TagSection task={task} />
            </Stack>
          </ContextMenu.Trigger>
          <ContextMenu.Content>
            <ContextMenu.Item onSelect={() => handleOpenNote(task.id)}>Open Note</ContextMenu.Item>
            <ContextMenu.Item onSelect={openDeleteDialog}>Delete</ContextMenu.Item>
          </ContextMenu.Content>
        </ContextMenu.Root>
      </Card>

      <Dialog isOpen={isDeleteDialogOpen} onClose={closeDeleteDialog}>
        <Dialog.Title>Delete this log?</Dialog.Title>
        <Dialog.Description>This action cannot be undone.</Dialog.Description>
        <Dialog.Footer>
          <Button variant="secondary" isFullWidth onClick={closeDeleteDialog}>
            Cancel
          </Button>
          <Button variant="primary" isFullWidth onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  )
}
