import { Task, TaskNote } from './src/types'

interface RendererAPI {
  task: {
    create: (task: Partial<Task>) => Promise<Task>
    get: (id: string) => Promise<Task | null>
    getAll: () => Promise<Task[]>
    update: (id: string, contents: Partial<Task>) => Promise<Task>
    softDelete: (id: string) => Promise<void>
  }
  note: {
    findByTaskId: (taskId: string) => Promise<TaskNote | null>
    autoSave: (
      taskId: string,
      content: string,
      clientUpdatedAt: number
    ) => Promise<TaskNote & { savedAt: number; conflict: boolean }>
  }
}

declare global {
  interface Window {
    api: RendererAPI
  }
}
