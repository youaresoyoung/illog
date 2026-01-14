export interface AccomplishmentItem {
  id: string
  text: string
  completed: boolean
}

export interface UpdateWeeklyReflectionRequest {
  accomplishments?: AccomplishmentItem[]
  improvements?: string[]
  nextWeekFocus?: string[]
}

export interface CreateWeeklyReflectionRequest {
  weekId: string
  accomplishments?: AccomplishmentItem[]
  improvements?: string[]
  nextWeekFocus?: string[]
}

export interface WeeklyReflectionResponse {
  id: string
  weekId: string
  accomplishments: AccomplishmentItem[]
  improvements: string[]
  nextWeekFocus: string[]
  createdAt: string
  updatedAt: string
}
