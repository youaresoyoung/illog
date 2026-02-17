import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { TASK_CREATED } from '@illog/analytics'
import type {
  Tag,
  Project,
  TaskFilterParams,
  TaskWithTags,
  UpdateTaskRequest,
  TaskTypeWithSubtypesDto
} from '../../../../shared/types'

export const useTodayTasks = () => {
  return useQuery({
    queryKey: queryKeys.tasks.today(),
    queryFn: () => {
      const now = new Date()
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
      return window.api.task.getTasksWithTags({
        startTime: startOfDay.toISOString(),
        endTime: endOfDay.toISOString()
      })
    }
  })
}

export const useTaskById = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => window.api.task.getWithTags(id),
    enabled: !!id
  })
}

export const useTasksByFilters = (filters: TaskFilterParams) => {
  return useQuery({
    queryKey: queryKeys.tasks.filtered(filters),
    queryFn: () => window.api.task.getTasksWithTags(filters),
    enabled: !!filters.projectId
  })
}

export const useAllTasks = () => {
  return useQuery({
    queryKey: queryKeys.tasks.all,
    queryFn: () => window.api.task.getTasksWithTags()
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => window.api.task.create(),
    meta: { errorMessage: 'Failed to create log' },
    onSuccess: (newTask) => {
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old ? [newTask, ...old] : [newTask]
      )
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) =>
        old ? [newTask, ...old] : [newTask]
      )
      window.api?.analytics?.track(TASK_CREATED)
    }
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      window.api.task.update(id, data),
    meta: { errorMessage: 'Failed to save changes' },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.today() })
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all })
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.detail(id) })

      const previousTodayTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())
      const previousAllTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.all)
      const previousTask = queryClient.getQueryData<TaskWithTags>(queryKeys.tasks.detail(id))

      const safeUpdate: Partial<TaskWithTags> = {}
      if (data.title !== undefined) safeUpdate.title = data.title
      if (data.description !== undefined) safeUpdate.description = data.description
      if (data.status !== undefined) safeUpdate.status = data.status
      if (data.projectId !== undefined) safeUpdate.projectId = data.projectId

      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === id ? { ...task, ...safeUpdate } : task))
      )

      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) =>
        old?.map((task) => (task.id === id ? { ...task, ...safeUpdate } : task))
      )

      queryClient.setQueryData<TaskWithTags>(queryKeys.tasks.detail(id), (old) =>
        old ? { ...old, ...safeUpdate } : old
      )

      return { previousTodayTasks, previousAllTasks, previousTask, id }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodayTasks) {
        queryClient.setQueryData(queryKeys.tasks.today(), context.previousTodayTasks)
      }
      if (context?.previousAllTasks) {
        queryClient.setQueryData(queryKeys.tasks.all, context.previousAllTasks)
      }
      if (context?.previousTask && context?.id) {
        queryClient.setQueryData(queryKeys.tasks.detail(context.id), context.previousTask)
      }
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)

      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )

      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
    }
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => window.api.task.softDelete(id),
    meta: { errorMessage: 'Failed to delete log', successMessage: 'Log deleted' },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.today() })
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all })

      const previousTodayTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())
      const previousAllTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.all)

      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.filter((task) => task.id !== id)
      )
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) =>
        old?.filter((task) => task.id !== id)
      )

      return { previousTodayTasks, previousAllTasks }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodayTasks) {
        queryClient.setQueryData(queryKeys.tasks.today(), context.previousTodayTasks)
      }
      if (context?.previousAllTasks) {
        queryClient.setQueryData(queryKeys.tasks.all, context.previousAllTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
    }
  })
}

export const useAddTagToTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) =>
      window.api.task.addTag(taskId, tagId),
    meta: { errorMessage: 'Failed to add tag' },
    onMutate: async ({ taskId, tagId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.today() })
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all })

      const previousTodayTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())
      const previousAllTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.all)
      const allTags = queryClient.getQueryData<Tag[]>(queryKeys.tags.all)
      const tagToAdd = allTags?.find((t) => t.id === tagId)

      if (tagToAdd) {
        queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
          old?.map((task) =>
            task.id === taskId && !task.tags.some((t) => t.id === tagId)
              ? { ...task, tags: [...task.tags, tagToAdd] }
              : task
          )
        )
        queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) =>
          old?.map((task) =>
            task.id === taskId && !task.tags.some((t) => t.id === tagId)
              ? { ...task, tags: [...task.tags, tagToAdd] }
              : task
          )
        )
      }

      return { previousTodayTasks, previousAllTasks }
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodayTasks) {
        queryClient.setQueryData(queryKeys.tasks.today(), context.previousTodayTasks)
      }
      if (context?.previousAllTasks) {
        queryClient.setQueryData(queryKeys.tasks.all, context.previousAllTasks)
      }
    }
  })
}

export const useRemoveTagFromTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) =>
      window.api.task.removeTag(taskId, tagId),
    meta: { errorMessage: 'Failed to remove tag' },
    onMutate: async ({ taskId, tagId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.today() })
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all })

      const previousTodayTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())
      const previousAllTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.all)

      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) =>
          task.id === taskId ? { ...task, tags: task.tags.filter((tag) => tag.id !== tagId) } : task
        )
      )

      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) =>
        old?.map((task) =>
          task.id === taskId ? { ...task, tags: task.tags.filter((tag) => tag.id !== tagId) } : task
        )
      )

      return { previousTodayTasks, previousAllTasks }
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodayTasks) {
        queryClient.setQueryData(queryKeys.tasks.today(), context.previousTodayTasks)
      }
      if (context?.previousAllTasks) {
        queryClient.setQueryData(queryKeys.tasks.all, context.previousAllTasks)
      }
    }
  })
}

export const useSetProjectToTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, projectId }: { taskId: string; projectId: string }) =>
      window.api.task.update(taskId, { projectId }),
    meta: { errorMessage: 'Failed to set project' },
    onMutate: async ({ taskId, projectId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.today() })
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all })

      const previousTodayTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())
      const previousAllTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.all)
      const allProjects = queryClient.getQueryData<Project[]>(queryKeys.projects.all)
      const projectToSet = allProjects?.find((p) => p.id === projectId)

      if (projectToSet) {
        const updateFn = (task: TaskWithTags) =>
          task.id === taskId
            ? {
                ...task,
                projectId,
                project: {
                  id: projectToSet.id,
                  name: projectToSet.name,
                  color: projectToSet.color
                }
              }
            : task

        queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
          old?.map(updateFn)
        )
        queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) => old?.map(updateFn))
      }

      return { previousTodayTasks, previousAllTasks }
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodayTasks) {
        queryClient.setQueryData(queryKeys.tasks.today(), context.previousTodayTasks)
      }
      if (context?.previousAllTasks) {
        queryClient.setQueryData(queryKeys.tasks.all, context.previousAllTasks)
      }
    }
  })
}

export const useClearProjectFromTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) => window.api.task.update(taskId, { projectId: null }),
    meta: { errorMessage: 'Failed to remove project' },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.today() })
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all })

      const previousTodayTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())
      const previousAllTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.all)

      const updateFn = (task: TaskWithTags) =>
        task.id === taskId ? { ...task, projectId: null, project: null } : task

      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) => old?.map(updateFn))
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) => old?.map(updateFn))

      return { previousTodayTasks, previousAllTasks }
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodayTasks) {
        queryClient.setQueryData(queryKeys.tasks.today(), context.previousTodayTasks)
      }
      if (context?.previousAllTasks) {
        queryClient.setQueryData(queryKeys.tasks.all, context.previousAllTasks)
      }
    }
  })
}

export const useSetTaskTypeToTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, taskTypeId }: { taskId: string; taskTypeId: string }) =>
      window.api.task.update(taskId, { taskTypeId, taskSubtypeId: null }),
    meta: { errorMessage: 'Failed to set task type' },
    onMutate: async ({ taskId, taskTypeId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.today() })
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all })

      const previousTodayTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())
      const previousAllTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.all)
      const allTaskTypes = queryClient.getQueryData<TaskTypeWithSubtypesDto[]>(
        queryKeys.taskTypes.withSubtypes()
      )
      const taskTypeToSet = allTaskTypes?.find((t) => t.id === taskTypeId)

      if (taskTypeToSet) {
        const updateFn = (task: TaskWithTags) =>
          task.id === taskId
            ? {
                ...task,
                taskTypeId,
                taskType: {
                  id: taskTypeToSet.id,
                  name: taskTypeToSet.name,
                  color: taskTypeToSet.color
                },
                taskSubtypeId: null,
                taskSubtype: null
              }
            : task

        queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
          old?.map(updateFn)
        )
        queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) => old?.map(updateFn))
      }

      return { previousTodayTasks, previousAllTasks }
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodayTasks) {
        queryClient.setQueryData(queryKeys.tasks.today(), context.previousTodayTasks)
      }
      if (context?.previousAllTasks) {
        queryClient.setQueryData(queryKeys.tasks.all, context.previousAllTasks)
      }
    }
  })
}

export const useSetTaskSubtypeToTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, taskSubtypeId }: { taskId: string; taskSubtypeId: string }) =>
      window.api.task.update(taskId, { taskSubtypeId }),
    meta: { errorMessage: 'Failed to set task subtype' },
    onMutate: async ({ taskId, taskSubtypeId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.today() })
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all })

      const previousTodayTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())
      const previousAllTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.all)
      const allTaskTypes = queryClient.getQueryData<TaskTypeWithSubtypesDto[]>(
        queryKeys.taskTypes.withSubtypes()
      )
      const taskSubtypeToSet = allTaskTypes
        ?.flatMap((t) => t.subtypes || [])
        .find((s) => s.id === taskSubtypeId)

      if (taskSubtypeToSet) {
        const updateFn = (task: TaskWithTags) =>
          task.id === taskId
            ? {
                ...task,
                taskSubtypeId,
                taskSubtype: {
                  id: taskSubtypeToSet.id,
                  name: taskSubtypeToSet.name,
                  color: taskSubtypeToSet.color ?? 'gray'
                }
              }
            : task

        queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
          old?.map(updateFn)
        )
        queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) => old?.map(updateFn))
      }

      return { previousTodayTasks, previousAllTasks }
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodayTasks) {
        queryClient.setQueryData(queryKeys.tasks.today(), context.previousTodayTasks)
      }
      if (context?.previousAllTasks) {
        queryClient.setQueryData(queryKeys.tasks.all, context.previousAllTasks)
      }
    }
  })
}

export const useClearTaskTypeFromTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (taskId: string) =>
      window.api.task.update(taskId, { taskTypeId: null, taskSubtypeId: null }),
    meta: { errorMessage: 'Failed to remove task type' },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.today() })
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all })

      const previousTodayTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())
      const previousAllTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.all)

      const updateFn = (task: TaskWithTags) =>
        task.id === taskId
          ? { ...task, taskTypeId: null, taskType: null, taskSubtypeId: null, taskSubtype: null }
          : task

      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) => old?.map(updateFn))
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) => old?.map(updateFn))

      return { previousTodayTasks, previousAllTasks }
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.all, (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTodayTasks) {
        queryClient.setQueryData(queryKeys.tasks.today(), context.previousTodayTasks)
      }
      if (context?.previousAllTasks) {
        queryClient.setQueryData(queryKeys.tasks.all, context.previousAllTasks)
      }
    }
  })
}
