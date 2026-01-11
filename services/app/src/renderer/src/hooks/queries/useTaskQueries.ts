import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import type {
  Tag,
  TaskFilterParams,
  TaskWithTags,
  UpdateTaskRequest
} from '../../../../shared/types'

export const useTodayTasks = () => {
  return useQuery({
    queryKey: queryKeys.tasks.today(),
    queryFn: () =>
      window.api.task.getTasksWithTags({ startTime: new Date().toISOString().split('T')[0] })
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
    enabled: !!filters
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => window.api.task.create(),
    onSuccess: (newTask) => {
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old ? [...old, newTask] : [newTask]
      )
    }
  })
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      window.api.task.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.today() })
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.detail(id) })

      const previousTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())
      const previousTask = queryClient.getQueryData<TaskWithTags>(queryKeys.tasks.detail(id))

      const safeUpdate: Partial<TaskWithTags> = {}
      if (data.title !== undefined) safeUpdate.title = data.title
      if (data.description !== undefined) safeUpdate.description = data.description
      if (data.status !== undefined) safeUpdate.status = data.status
      if (data.projectId !== undefined) safeUpdate.projectId = data.projectId

      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === id ? { ...task, ...safeUpdate } : task))
      )

      queryClient.setQueryData<TaskWithTags>(queryKeys.tasks.detail(id), (old) =>
        old ? { ...old, ...safeUpdate } : old
      )

      return { previousTasks, previousTask, id }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks.today(), context.previousTasks)
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
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(variables.id) })
    }
  })
}

export const useDeleteTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => window.api.task.softDelete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.today() })

      const previousTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())

      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.filter((task) => task.id !== id)
      )

      return { previousTasks }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks.today(), context.previousTasks)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.today() })
    }
  })
}

export const useAddTagToTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) =>
      window.api.task.addTag(taskId, tagId),
    onMutate: async ({ taskId, tagId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.today() })

      const previousTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())
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
      }

      return { previousTasks }
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks.today(), context.previousTasks)
      }
    }
  })
}

export const useRemoveTagFromTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) =>
      window.api.task.removeTag(taskId, tagId),
    onMutate: async ({ taskId, tagId }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.today() })

      const previousTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())

      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) =>
          task.id === taskId ? { ...task, tags: task.tags.filter((tag) => tag.id !== tagId) } : task
        )
      )

      return { previousTasks }
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks.today(), context.previousTasks)
      }
    }
  })
}
