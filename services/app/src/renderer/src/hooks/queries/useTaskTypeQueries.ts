import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import { CreateTaskTypeRequest, UpdateTaskTypeRequest, TaskType } from '../../types'

export const useAllTaskTypes = () => {
  return useQuery({
    queryKey: queryKeys.taskTypes.all,
    queryFn: () => window.api.taskType.getAll()
  })
}

export const useAllTaskTypesWithSubtypes = () => {
  return useQuery({
    queryKey: queryKeys.taskTypes.withSubtypes(),
    queryFn: () => window.api.taskType.getAllWithSubtypes()
  })
}

export const useTaskType = (id: string) => {
  return useQuery({
    queryKey: queryKeys.taskTypes.detail(id),
    queryFn: () => window.api.taskType.get(id),
    enabled: !!id
  })
}

export const useCreateTaskType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (taskType: CreateTaskTypeRequest) => {
      return await window.api.taskType.create(taskType)
    },
    meta: { errorMessage: 'Failed to create task type', successMessage: 'Task type created' },
    onSuccess: (newTaskType) => {
      queryClient.setQueryData<TaskType[]>(queryKeys.taskTypes.all, (old) => {
        if (!old) return [newTaskType]
        const exists = old.find((t) => t.id === newTaskType.id)
        if (exists) {
          return old.map((t) => (t.id === newTaskType.id ? newTaskType : t))
        }
        return [...old, newTaskType]
      })

      queryClient.invalidateQueries({ queryKey: queryKeys.taskTypes.withSubtypes() })
    }
  })
}

export const useUpdateTaskType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTaskTypeRequest }) => {
      return await window.api.taskType.update(id, data)
    },
    meta: { errorMessage: 'Failed to update task type' },
    onMutate: async ({ id, data }: { id: string; data: UpdateTaskTypeRequest }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.taskTypes.all })

      const previousTaskTypes = queryClient.getQueryData<TaskType[]>(queryKeys.taskTypes.all)

      queryClient.setQueryData<TaskType[]>(queryKeys.taskTypes.all, (old) => {
        if (!old) return []
        return old.map((t) => (t.id === id ? { ...t, ...data } : t))
      })

      return { previousTaskTypes }
    },
    onSuccess: (updatedTaskType) => {
      queryClient.setQueryData<TaskType[]>(queryKeys.taskTypes.all, (old) => {
        if (!old) return [updatedTaskType]
        return old.map((t) => (t.id === updatedTaskType.id ? updatedTaskType : t))
      })

      queryClient.invalidateQueries({ queryKey: queryKeys.taskTypes.withSubtypes() })
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTaskTypes) {
        queryClient.setQueryData(queryKeys.taskTypes.all, context.previousTaskTypes)
      }
    }
  })
}

export const useDeleteTaskType = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return await window.api.taskType.softDelete(id)
    },
    meta: { errorMessage: 'Failed to delete task type', successMessage: 'Task type deleted' },
    onSuccess: (_data, id) => {
      queryClient.setQueryData<TaskType[]>(queryKeys.taskTypes.all, (old) => {
        if (!old) return []
        return old.filter((t) => t.id !== id)
      })

      queryClient.invalidateQueries({ queryKey: queryKeys.taskTypes.withSubtypes() })
    }
  })
}
