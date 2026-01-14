import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'
import type {
  UpdateWeeklyReflectionRequest,
  WeeklyReflectionResponse
} from '../../../../shared/types'

export const useWeeklyReflection = (weekId: string) => {
  return useQuery({
    queryKey: queryKeys.weeklyReflections.byWeekId(weekId),
    queryFn: () => window.api.weeklyReflection.get(weekId),
    enabled: !!weekId
  })
}

export const useUpdateWeeklyReflection = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ weekId, data }: { weekId: string; data: UpdateWeeklyReflectionRequest }) =>
      window.api.weeklyReflection.upsert(weekId, data),
    onMutate: async ({ weekId, data }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.weeklyReflections.byWeekId(weekId)
      })

      const previousData = queryClient.getQueryData<WeeklyReflectionResponse>(
        queryKeys.weeklyReflections.byWeekId(weekId)
      )

      if (previousData) {
        queryClient.setQueryData<WeeklyReflectionResponse>(
          queryKeys.weeklyReflections.byWeekId(weekId),
          {
            ...previousData,
            ...data,
            updatedAt: new Date().toISOString()
          }
        )
      }

      return { previousData, weekId }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData && context?.weekId) {
        queryClient.setQueryData(
          queryKeys.weeklyReflections.byWeekId(context.weekId),
          context.previousData
        )
      }
    },
    onSettled: (_data, _error, { weekId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.weeklyReflections.byWeekId(weekId)
      })
    }
  })
}
