import { Task } from './src/main/database/schema'
import { OmittedTag, Tag, TaskFilters, TaskNote, TaskReflection, TaskWithTags } from './src/types'

interface RendererAPI {
  task: {
    create: (task: Partial<Task>) => Promise<TaskWithTags>
    get: (id: string) => Promise<Task | null>
    getWithTags: (id: string) => Promise<TaskWithTags | null>
    getTasksWithTags: (filters?: TaskFilters) => Promise<TaskWithTags[]>
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
    reflectionNoteStream: (
      taskId: string,
      text: string,
      onChunk: (data: { chunk: string; done: boolean }) => void
    ) => Promise<void>
    removeReflectionListener: () => Promise<void>
    getReflection: (taskId: string) => Promise<TaskReflection | null>
    deleteReflection: (taskId: string) => Promise<void>
  }
  tag: {
    create: (tag: Partial<OmittedTag>) => Promise<Tag>
    get: (id: string) => Promise<Tag | null>
    getAll: () => Promise<Tag[] | []>
    update: (id: string, contents: Partial<OmittedTag>) => Promise<Tag>
    softDelete: (id: string) => Promise<void>
  }
}

interface ThemeAPI {
  onChange: (callback: (isDark: boolean) => void) => void
}

declare global {
  interface Window {
    api: RendererAPI
    theme: ThemeAPI
  }
}
