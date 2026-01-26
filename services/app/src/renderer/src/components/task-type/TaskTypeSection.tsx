import { useMemo } from 'react'
import {
  Stack,
  ProjectBadge,
  ProjectSelector,
  Divider,
  useProjectSelectorContext,
  type ProjectType,
  type OmittedProject
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

const TaskTypeBadgeTrigger = ({ taskType }: { taskType: ProjectType | null }) => {
  const { isOpen } = useProjectSelectorContext()

  return (
    <Stack minW="0" overflow="hidden">
      {taskType ? (
        <ProjectBadge project={taskType} isOpenedSelector={isOpen} />
      ) : (
        <ProjectBadge
          project={{ name: 'Add Type', color: 'gray' }}
          isOpenedSelector={isOpen}
          addButtonVariant={'default'}
        />
      )}
    </Stack>
  )
}

const TaskSubtypeBadgeTrigger = ({ taskSubtype }: { taskSubtype: { name: string } | null }) => {
  const { isOpen } = useProjectSelectorContext()

  return (
    <Stack minW="0" overflow="hidden">
      {taskSubtype ? (
        <ProjectBadge
          project={{ name: taskSubtype.name, color: 'gray' }}
          isOpenedSelector={isOpen}
        />
      ) : (
        <ProjectBadge
          project={{ name: 'Add Subtype', color: 'gray' }}
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
      })) as ProjectType[],
    [taskTypesWithSubtypes]
  )

  const selectedTaskType = useMemo(() => {
    if (!task.taskType) return null
    const found = taskTypesWithSubtypes.find((t) => t.id === task.taskType?.id)
    if (found) {
      return { id: found.id, name: found.name, color: found.color } as ProjectType
    }
    return task.taskType as ProjectType
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

  const handleCreateTaskType = async (data: Partial<OmittedProject>) => {
    if (!data.name) throw new Error('Task type name is required')
    const newTaskType = await createTaskType({
      name: data.name,
      color: data.color
    } as CreateTaskTypeRequest)
    return newTaskType.id
  }

  const handleUpdateTaskType = async (taskTypeId: string, data: Partial<OmittedProject>) => {
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

  const handleCreateTaskSubtype = async (data: Partial<OmittedProject>) => {
    if (!data.name || !task.taskType) throw new Error('Subtype name and task type are required')
    const newSubtype = await createTaskSubtype({
      taskTypeId: task.taskType.id,
      name: data.name
    })
    return newSubtype.id
  }

  const handleUpdateTaskSubtype = async (subtypeId: string, data: Partial<OmittedProject>) => {
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
      <ProjectSelector.Root
        projects={taskTypeList}
        selectedProject={selectedTaskType}
        onSelectProject={handleSelectTaskType}
        onClearProject={handleClearTaskType}
        onCreateProject={handleCreateTaskType}
        onDeleteProject={handleDeleteTaskType}
        onUpdateProject={handleUpdateTaskType}
      >
        <ProjectSelector.Trigger asChild>
          <TaskTypeBadgeTrigger taskType={selectedTaskType} />
        </ProjectSelector.Trigger>

        <ProjectSelector.Content>
          <ProjectSelector.Search placeholder="Search task types..." />
          <Divider />
          <ProjectSelector.List />
        </ProjectSelector.Content>
      </ProjectSelector.Root>

      {task.taskType && (
        <ProjectSelector.Root
          projects={subtypeList}
          selectedProject={
            selectedTaskSubtype
              ? ({
                  id: selectedTaskSubtype.id,
                  name: selectedTaskSubtype.name,
                  color: 'gray'
                } as ProjectType)
              : null
          }
          onSelectProject={handleSelectTaskSubtype}
          onClearProject={handleClearTaskSubtype}
          onCreateProject={handleCreateTaskSubtype}
          onDeleteProject={handleDeleteTaskSubtype}
          onUpdateProject={handleUpdateTaskSubtype}
        >
          <ProjectSelector.Trigger asChild>
            <TaskSubtypeBadgeTrigger taskSubtype={selectedTaskSubtype} />
          </ProjectSelector.Trigger>

          <ProjectSelector.Content>
            <ProjectSelector.Search placeholder="Search subtypes..." />
            <Divider />
            <ProjectSelector.List />
          </ProjectSelector.Content>
        </ProjectSelector.Root>
      )}
    </>
  )
}
