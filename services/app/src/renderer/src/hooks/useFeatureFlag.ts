import { useMemo } from 'react'
import type { FeatureId, FeatureFlag } from '../types'
import { useUserPlanInfo } from './queries/useUserQueries'

/**
 * @example
 * const { enabled, requiredPlan, isLoading } = useFeatureFlag('ai.reflection')
 * if (!enabled) return <ProBadge requiredPlan={requiredPlan} />
 */
export function useFeatureFlag(featureId: FeatureId) {
  const { data, isLoading } = useUserPlanInfo()

  return useMemo(() => {
    if (!data) {
      return { enabled: false, requiredPlan: undefined, isLoading }
    }

    const flag: FeatureFlag | undefined = data.features.find((f) => f.id === featureId)

    return {
      enabled: flag?.enabled ?? false,
      requiredPlan: flag?.requiredPlan,
      isLoading
    }
  }, [data, featureId, isLoading])
}

/**
 * @example
 * const flags = useFeatureFlags(['ai.reflection', 'ai.suggestion'])
 * flags['ai.reflection'].enabled // boolean
 */
export function useFeatureFlags(featureIds: FeatureId[]) {
  const { data, isLoading } = useUserPlanInfo()

  return useMemo(() => {
    const result: Record<string, { enabled: boolean; requiredPlan?: string }> = {}

    for (const id of featureIds) {
      if (!data) {
        result[id] = { enabled: false, requiredPlan: undefined }
        continue
      }
      const flag = data.features.find((f) => f.id === id)
      result[id] = {
        enabled: flag?.enabled ?? false,
        requiredPlan: flag?.requiredPlan
      }
    }

    return { flags: result, isLoading }
  }, [data, featureIds, isLoading])
}

/**
 * @example
 * const { plan, isLocal } = useCurrentPlan()
 */
export function useCurrentPlan() {
  const { data, isLoading } = useUserPlanInfo()

  return useMemo(
    () => ({
      plan: data?.profile.plan ?? 'local',
      isLocal: !data || data.profile.plan === 'local',
      profile: data?.profile ?? null,
      isLoading
    }),
    [data, isLoading]
  )
}
