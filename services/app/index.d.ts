import { OmittedTag, Tag, Task, TaskNote, TaskWithTags } from './src/types'

interface RendererAPI {
  task: {
    create: (task: Partial<Task>) => Promise<TaskWithTags>
    get: (id: string) => Promise<Task | null>
    getWithTags: (id: string) => Promise<TaskWithTags | null>
    getAll: () => Promise<TaskWithTags[]>
    update: (id: string, contents: Partial<Task>) => Promise<TaskWithTags>
    addTag: (taskId: string, tagId: string) => Promise<TaskWithTags>
    softDelete: (id: string) => Promise<void>
    removeTag: (taskId: string, tagId: string) => Promise<TaskWithTags>
  }
  note: {
    findByTaskId: (taskId: string) => Promise<TaskNote | null>
    autoSave: (
      taskId: string,
      content: string,
      clientUpdatedAt: number
    ) => Promise<{ note: TaskNote; savedAt: number; conflict: boolean }>
  }
  tag: {
    create: (tag: Partial<OmittedTag>) => Promise<Tag>
    get: (id: string) => Promise<Tag | null>
    getAll: () => Promise<Tag[] | []>
    update: (id: string, contents: Partial<OmittedTag>) => Promise<Tag>
    softDelete: (id: string) => Promise<void>
  }
}

declare global {
  interface Window {
    api: RendererAPI
  }
}
