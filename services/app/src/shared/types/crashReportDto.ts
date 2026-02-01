export interface CrashReportSettings {
  enabled: boolean
  anonymousId: string
}

export interface UpdateCrashReportSettingsRequest {
  enabled: boolean
}
