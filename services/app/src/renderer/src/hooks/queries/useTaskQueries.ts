import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { OmittedTask, TaskWithTags } from '../../../../types'
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

      const previousTasks = queryClient.getQueryData<TaskWithTags[]>(queryKeys.tasks.today())

      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === id ? { ...task, ...contents } : task))
      )

      return { previousTasks }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(queryKeys.tasks.today(), context.previousTasks)
      }
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.today() })
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
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
    }
  })
}

export const useRemoveTagFromTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) =>
      window.api.task.removeTag(taskId, tagId),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<TaskWithTags[]>(queryKeys.tasks.today(), (old) =>
        old?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      )
      queryClient.setQueryData(queryKeys.tasks.detail(updatedTask.id), updatedTask)
    }
  })
}
