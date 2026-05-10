import { FeatureFlag, FeatureId, UserPlan, UserPlanInfo, UserProfile } from '../types'

/**
 * Current
 * - Local users: all features disabled (no auth, single 'local' plan)
 *
 * Future
 * - With auth: users can be on 'free', 'pro', or 'enterprise' plans
 * - RemoteConfigService will fetch enabled features for the user's plan from the server
 * - DB schema will store user profile with plan info, and feature flags
 *
 * Plan & Feature Service
 * - local: No features enabled for local users (current)
 * - free: No features enabled for free plan (placeholder for future)
 * - pro: Cloud sync and PDF export enabled (future)
 * - enterprise: Same features as Pro for now (future)
 */

export class UserService {
  private static readonly PLAN_FEATURES: Record<UserPlan, Set<FeatureId>> = {
    local: new Set<FeatureId>([]),
    free: new Set<FeatureId>([]),
    pro: new Set<FeatureId>([
      'ai.reflection',
      'ai.weekly-summary',
      'ai.suggestion',
      'sync.cloud',
      'export.pdf'
    ]),
    enterprise: new Set<FeatureId>([
      'ai.reflection',
      'ai.weekly-summary',
      'ai.suggestion',
      'sync.cloud',
      'export.pdf'
    ])
  }

  private static readonly ALL_FEATURES: FeatureId[] = [
    'ai.reflection',
    'ai.weekly-summary',
    'ai.suggestion',
    'sync.cloud',
    'export.pdf'
  ]

  private static readonly REQUIRED_PLAN: Record<FeatureId, UserPlan> = {
    'ai.reflection': 'pro',
    'ai.weekly-summary': 'pro',
    'ai.suggestion': 'pro',
    'sync.cloud': 'pro',
    'export.pdf': 'pro'
  }

  getCurrentProfile(): UserProfile {
    // TODO: Future implementation will fetch from DB or remote config -> this.authProvider.getCurrentUser()
    return {
      id: 'local-user',
      plan: 'local'
    }
  }

  getUserPlanInfo(): UserPlanInfo {
    const profile = this.getCurrentProfile()
    const features = this.buildFeatureFlags(profile.plan)
    return { profile, features }
  }

  isFeatureEnabled(featureId: FeatureId): boolean {
    const profile = this.getCurrentProfile()
    const enabledSet = UserService.PLAN_FEATURES[profile.plan]
    return enabledSet.has(featureId)
  }

  private buildFeatureFlags(plan: UserPlan): FeatureFlag[] {
    const enabledSet = UserService.PLAN_FEATURES[plan]

    return UserService.ALL_FEATURES.map((id) => ({
      id,
      enabled: enabledSet.has(id),
      requiredPlan: UserService.REQUIRED_PLAN[id]
    }))
  }
}
