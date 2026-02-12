// NOTE: Plan & Feature
// - 현재: 로컬 전용 (auth 없음), 모든 유저 = 'local'
// - 미래: auth 도입 후 free / pro / enterprise 플랜 전환

export type UserPlan = 'local' | 'free' | 'pro' | 'enterprise'

export type FeatureId =
  | 'ai.reflection'
  | 'ai.weekly-summary'
  | 'ai.suggestion'
  | 'sync.cloud'
  | 'export.pdf'

export interface FeatureFlag {
  id: FeatureId
  enabled: boolean
  /**  Required minimum plan (undefined = available in all plans) */
  requiredPlan?: UserPlan
}

export interface UserProfile {
  /** Current: 'local-user' | Future: auth provider id */
  id: string
  plan: UserPlan
}

export interface UserPlanInfo {
  profile: UserProfile
  features: FeatureFlag[]
}
