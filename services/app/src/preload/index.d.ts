import { Task } from './../types'

interface RendererAPI {
  task: {
    create: (task: Partial<Task>) => Promise<void>
  }
}

declare global {
  interface Window {
    api: RendererAPI
  }
}
