export const queryKeys = {
  tasks: {
    all: ['tasks'] as const,
    today: () => [...queryKeys.tasks.all, 'today'] as const,
    detail: (id: string) => [...queryKeys.tasks.all, 'detail', id] as const
  },
  tags: {
    all: ['tags'] as const,
    detail: (id: string) => [...queryKeys.tags.all, 'detail', id] as const
  },
  notes: {
    all: ['notes'] as const,
    byTaskId: (taskId: string) => [...queryKeys.notes.all, 'task', taskId] as const
  }
}
