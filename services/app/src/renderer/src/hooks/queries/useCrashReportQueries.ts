import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from './queryKeys'

export const useCrashReportSettings = () => {
  return useQuery({
    queryKey: queryKeys.crashReport.settings(),
    queryFn: () => window.api.crashReport.getSettings()
  })
}

export const useUpdateCrashReportSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (enabled: boolean) => window.api.crashReport.updateSettings({ enabled }),
    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(queryKeys.crashReport.settings(), updatedSettings)
    }
  })
}

export const useSendCrashReport = () => {
  return useMutation({
    mutationFn: (error: { message: string; stack?: string }) =>
      window.api.crashReport.sendReport(error)
  })
}

export const useOnboardingStatus = () => {
  return useQuery({
    queryKey: queryKeys.crashReport.onboarding(),
    queryFn: () => window.api.crashReport.isOnboardingCompleted()
  })
}

export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => window.api.crashReport.completeOnboarding(),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.crashReport.onboarding(), true)
    }
  })
}
