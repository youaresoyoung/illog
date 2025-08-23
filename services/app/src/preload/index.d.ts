import { Task } from './../types'

interface RendererAPI {
  task: {
    create: (task: Partial<Task>) => Promise<void>
    get: (id: string) => Promise<Task | null>
    getAll: () => Promise<Task[]>
  }
}

declare global {
  interface Window {
    api: RendererAPI
  }
}
