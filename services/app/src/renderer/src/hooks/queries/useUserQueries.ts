import { useQuery } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'

export const useUserPlanInfo = () => {
  return useQuery({
    queryKey: queryKeys.user.planInfo(),
    queryFn: () => window.api.user.getPlanInfo(),
    staleTime: Infinity // It won't change in local mode
  })
}
