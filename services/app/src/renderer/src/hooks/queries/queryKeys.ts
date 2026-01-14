import type { TaskFilterParams } from '../../../../shared/types'

export const queryKeys = {
  tasks: {
    all: ['tasks'] as const,
    today: () => [...queryKeys.tasks.all, 'today'] as const,
    detail: (id: string) => [...queryKeys.tasks.all, 'detail', id] as const,
    filtered: (filters: TaskFilterParams) => [...queryKeys.tasks.all, 'filtered', filters] as const
  },
  tags: {
    all: ['tags'] as const,
    detail: (id: string) => [...queryKeys.tags.all, 'detail', id] as const
  },
  projects: {
    all: ['projects'] as const,
    detail: (id: string) => [...queryKeys.projects.all, 'detail', id] as const
  },
  notes: {
    all: ['notes'] as const,
    byTaskId: (taskId: string) => [...queryKeys.notes.all, 'task', taskId] as const
  },
  reflections: {
    all: ['reflections'] as const,
    byTaskId: (taskId: string) => [...queryKeys.reflections.all, 'task', taskId] as const
  },
  weeklyReflections: {
    all: ['weeklyReflections'] as const,
    byWeekId: (weekId: string) => [...queryKeys.weeklyReflections.all, 'week', weekId] as const
  }
}
