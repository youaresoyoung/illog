import { useMemo } from 'react'
import {
  Badge,
  BadgeSelector,
  Divider,
  useBadgeSelectorContext,
  type BadgeItem,
  type OmittedBadgeItem,
  Stack
} from '@illog/ui'
import {
  useAllTaskTypesWithSubtypes,
  useCreateTaskType,
  useUpdateTaskType,
  useDeleteTaskType
} from '../../hooks/queries/useTaskTypeQueries'
import {
  useSetTaskTypeToTask,
  useSetTaskSubtypeToTask,
  useClearTaskTypeFromTask
} from '../../hooks/queries/useTaskQueries'
import type {
  TaskWithTags,
  CreateTaskTypeRequest,
  UpdateTaskTypeRequest
} from '../../../../shared/types'
import {
  useCreateTaskSubtype,
  useUpdateTaskSubtype,
  useDeleteTaskSubtype
} from '../../hooks/queries/useTaskSubtypeQueries'

const TaskTypeBadgeTrigger = ({ taskType }: { taskType: BadgeItem | null }) => {
  const { isOpen } = useBadgeSelectorContext()

  return (
    <Stack>
      {taskType ? (
        <Badge item={taskType} isOpenedSelector={isOpen} />
      ) : (
        <Badge
          item={{ name: 'Add Type', color: 'gray' }}
          isOpenedSelector={isOpen}
          addButtonVariant={'default'}
        />
      )}
    </Stack>
  )
}

const TaskSubtypeBadgeTrigger = ({ taskSubtype }: { taskSubtype: { name: string } | null }) => {
  const { isOpen } = useBadgeSelectorContext()

  return (
    <Stack>
      {taskSubtype ? (
        <Badge item={{ name: taskSubtype.name, color: 'gray' }} isOpenedSelector={isOpen} />
      ) : (
        <Badge
          item={{ name: 'Add Subtype', color: 'gray' }}
          isOpenedSelector={isOpen}
          addButtonVariant={'default'}
        />
      )}
    </Stack>
  )
}

export const TaskTypeSection = ({ task }: { task: TaskWithTags }) => {
  const { data: taskTypesWithSubtypes = [] } = useAllTaskTypesWithSubtypes()
  const { mutateAsync: createTaskType } = useCreateTaskType()
  const { mutateAsync: updateTaskType } = useUpdateTaskType()
  const { mutateAsync: deleteTaskType } = useDeleteTaskType()
  const { mutateAsync: createTaskSubtype } = useCreateTaskSubtype()
  const { mutateAsync: updateTaskSubtype } = useUpdateTaskSubtype()
  const { mutateAsync: deleteTaskSubtype } = useDeleteTaskSubtype()
  const { mutateAsync: setTaskType } = useSetTaskTypeToTask()
  const { mutateAsync: setTaskSubtype } = useSetTaskSubtypeToTask()
  const { mutateAsync: clearTaskType } = useClearTaskTypeFromTask()

  const taskTypeList = useMemo(
    () =>
      taskTypesWithSubtypes.map((t) => ({
        id: t.id,
        name: t.name,
        color: t.color
      })) as BadgeItem[],
    [taskTypesWithSubtypes]
  )

  const selectedTaskType = useMemo(() => {
    if (!task.taskType) return null
    const found = taskTypesWithSubtypes.find((t) => t.id === task.taskType?.id)
    if (found) {
      return { id: found.id, name: found.name, color: found.color } as BadgeItem
    }
    return task.taskType as BadgeItem
  }, [task.taskType, taskTypesWithSubtypes])

  const selectedTaskSubtype = useMemo(() => {
    if (!task.taskSubtype) return null
    return { id: task.taskSubtype.id, name: task.taskSubtype.name }
  }, [task.taskSubtype])

  const subtypeList = useMemo(() => {
    if (!task.taskType) return []
    const taskType = taskTypesWithSubtypes.find((t) => t.id === task.taskType?.id)
    if (!taskType) return []
    return (
      taskType.subtypes?.map((s) => ({
        id: s.id,
        name: s.name,
        color: 'gray' as const
      })) || []
    )
  }, [task.taskType, taskTypesWithSubtypes])

  const handleSelectTaskType = async (taskTypeId: string) => {
    await setTaskType({ taskId: task.id, taskTypeId })
  }

  const handleClearTaskType = async () => {
    await clearTaskType(task.id)
  }

  const handleCreateTaskType = async (data: Partial<OmittedBadgeItem>) => {
    if (!data.name) throw new Error('Task type name is required')
    const newTaskType = await createTaskType({
      name: data.name,
      color: data.color
    } as CreateTaskTypeRequest)
    return newTaskType.id
  }

  const handleUpdateTaskType = async (taskTypeId: string, data: Partial<OmittedBadgeItem>) => {
    await updateTaskType({ id: taskTypeId, data: data as UpdateTaskTypeRequest })
  }

  const handleDeleteTaskType = async (taskTypeId: string) => {
    await deleteTaskType(taskTypeId)
  }

  const handleSelectTaskSubtype = async (subtypeId: string) => {
    await setTaskSubtype({ taskId: task.id, taskSubtypeId: subtypeId })
  }

  const handleClearTaskSubtype = async () => {
    if (!task.taskType) return
    await setTaskType({ taskId: task.id, taskTypeId: task.taskType.id })
  }

  const handleCreateTaskSubtype = async (data: Partial<OmittedBadgeItem>) => {
    if (!data.name || !task.taskType) throw new Error('Subtype name and task type are required')
    const newSubtype = await createTaskSubtype({
      taskTypeId: task.taskType.id,
      name: data.name
    })
    return newSubtype.id
  }

  const handleUpdateTaskSubtype = async (subtypeId: string, data: Partial<OmittedBadgeItem>) => {
    if (!data.name || !task.taskType) throw new Error('Subtype name and task type are required')
    await updateTaskSubtype({
      id: subtypeId,
      taskTypeId: task.taskType.id,
      data: { name: data.name }
    })
  }

  const handleDeleteTaskSubtype = async (subtypeId: string) => {
    await deleteTaskSubtype(subtypeId)
  }

  return (
    <>
      <BadgeSelector.Root
        items={taskTypeList}
        selectedItem={selectedTaskType}
        onSelectItem={handleSelectTaskType}
        onClearItem={handleClearTaskType}
        onCreateItem={handleCreateTaskType}
        onDeleteItem={handleDeleteTaskType}
        onUpdateItem={handleUpdateTaskType}
      >
        <BadgeSelector.Trigger asChild>
          <TaskTypeBadgeTrigger taskType={selectedTaskType} />
        </BadgeSelector.Trigger>

        <BadgeSelector.Content>
          <BadgeSelector.Search placeholder="Search task types..." />
          <Divider />
          <BadgeSelector.List />
        </BadgeSelector.Content>
      </BadgeSelector.Root>

      {task.taskType && (
        <BadgeSelector.Root
          items={subtypeList}
          selectedItem={
            selectedTaskSubtype
              ? ({
                  id: selectedTaskSubtype.id,
                  name: selectedTaskSubtype.name,
                  color: 'gray'
                } as BadgeItem)
              : null
          }
          onSelectItem={handleSelectTaskSubtype}
          onClearItem={handleClearTaskSubtype}
          onCreateItem={handleCreateTaskSubtype}
          onDeleteItem={handleDeleteTaskSubtype}
          onUpdateItem={handleUpdateTaskSubtype}
        >
          <BadgeSelector.Trigger asChild>
            <TaskSubtypeBadgeTrigger taskSubtype={selectedTaskSubtype} />
          </BadgeSelector.Trigger>

          <BadgeSelector.Content>
            <BadgeSelector.Search placeholder="Search subtypes..." />
            <Divider />
            <BadgeSelector.List />
          </BadgeSelector.Content>
        </BadgeSelector.Root>
      )}
    </>
  )
}
