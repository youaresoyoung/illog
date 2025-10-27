import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { OmittedTask, TaskWithTags, Tag } from '../../../../types'
import { queryKeys } from './queryKeys'

export const useTodayTasks = () => {
  return useQuery({
    queryKey: queryKeys.tasks.today(),
    queryFn: () => window.api.task.getAll()
  })
}

export const useTask = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => window.api.task.getWithTags(id),
    enabled: !!id
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (task: Partial<OmittedTask>) => window.api.task.create(task),
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
    mutationFn: ({ id, contents }: { id: string; contents: Partial<OmittedTask> }) =>
      window.api.task.update(id, contents),
    onMutate: async ({ id, contents }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.today() })
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.detail(id) })

      const previousTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())
      const previousTask = queryClient.getQueryData<TaskWithTags>(queryKeys.tasks.detail(id))

      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === id ? { ...task, ...contents } : task))
      )

      queryClient.setQueryData<TaskWithTags>(queryKeys.tasks.detail(id), (old) =>
        old ? { ...old, ...contents } : old
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
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.today() })
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
      console.error('Failed to add tag to task:', _err)
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
      console.error('Failed to remove tag from task:', _err)
    }
  })
}
