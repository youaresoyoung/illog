import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { CreateTaskSubtypeRequest, TaskSubtype, UpdateTaskSubtypeRequest } from '../../types'
import { queryKeys } from './queryKeys'

export const useTaskSubtypesByTypeId = (typeId: string) => {
  return useQuery({
    queryKey: queryKeys.taskSubtypes.byTypeId(typeId),
    queryFn: () => window.api.taskSubtype.getAllByTypeId(typeId),
    enabled: !!typeId
  })
}

export const useTaskSubtype = (id: string) => {
  return useQuery({
    queryKey: queryKeys.taskSubtypes.detail(id),
    queryFn: () => window.api.taskSubtype.get(id),
    enabled: !!id
  })
}

export const useCreateTaskSubtype = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (subtype: CreateTaskSubtypeRequest) => {
      return await window.api.taskSubtype.create(subtype)
    },
    onSuccess: (newSubtype) => {
      queryClient.setQueryData<TaskSubtype[]>(
        queryKeys.taskSubtypes.byTypeId(newSubtype.taskTypeId),
        (old) => {
          if (!old) return [newSubtype]
          const exists = old.find((s) => s.id === newSubtype.id)
          if (exists) {
            return old.map((s) => (s.id === newSubtype.id ? newSubtype : s))
          }
          return [...old, newSubtype]
        }
      )

      queryClient.invalidateQueries({ queryKey: queryKeys.taskTypes.withSubtypes() })
    },
    onError: () => {}
  })
}

export const useUpdateTaskSubtype = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string
      taskTypeId: string
      data: UpdateTaskSubtypeRequest
    }) => {
      return await window.api.taskSubtype.update(id, data)
    },
    onMutate: async ({ id, taskTypeId, data }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.taskSubtypes.byTypeId(taskTypeId)
      })

      const previousSubtypes = queryClient.getQueryData<TaskSubtype[]>(
        queryKeys.taskSubtypes.byTypeId(taskTypeId)
      )

      queryClient.setQueryData<TaskSubtype[]>(
        queryKeys.taskSubtypes.byTypeId(taskTypeId),
        (old) => {
          if (!old) return []
          return old.map((s) => (s.id === id ? { ...s, ...data } : s))
        }
      )

      return { previousSubtypes, taskTypeId }
    },
    onSuccess: (updatedSubtype) => {
      queryClient.setQueryData<TaskSubtype[]>(
        queryKeys.taskSubtypes.byTypeId(updatedSubtype.taskTypeId),
        (old) => {
          if (!old) return [updatedSubtype]
          return old.map((s) => (s.id === updatedSubtype.id ? updatedSubtype : s))
        }
      )

      queryClient.invalidateQueries({ queryKey: queryKeys.taskTypes.withSubtypes() })
    },
    onError: (_error, _variables, context) => {
      if (context?.previousSubtypes && context?.taskTypeId) {
        queryClient.setQueryData(
          queryKeys.taskSubtypes.byTypeId(context.taskTypeId),
          context.previousSubtypes
        )
      }
    }
  })
}

export const useDeleteTaskSubtype = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      return await window.api.taskSubtype.softDelete(id)
    },
    onSuccess: (_data, id) => {
      queryClient.setQueriesData<TaskSubtype[]>(
        { queryKey: queryKeys.taskSubtypes.byTypeId('') },
        (old) => {
          if (!old) return []
          return old.filter((s) => s.id !== id)
        }
      )

      queryClient.invalidateQueries({ queryKey: queryKeys.taskTypes.withSubtypes() })
    },
    onError: () => {}
  })
}
