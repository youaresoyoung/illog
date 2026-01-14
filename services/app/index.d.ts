import type {
  Task,
  Tag,
  Project,
  TaskWithTags,
  TaskNote,
  TaskReflection,
  TaskFilterParams,
  UpdateTaskRequest,
  CreateTagRequest,
  UpdateTagRequest,
  CreateProjectRequest,
  UpdateProjectRequest
} from './src/shared/types'

interface RendererAPI {
  task: {
    create: () => Promise<TaskWithTags>
    get: (id: string) => Promise<Task | null>
    getWithTags: (id: string) => Promise<TaskWithTags | null>
    getTasksWithTags: (filters?: TaskFilterParams) => Promise<TaskWithTags[]>
    update: (id: string, data: UpdateTaskRequest) => Promise<TaskWithTags>
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
    create: (data: CreateTagRequest) => Promise<Tag>
    get: (id: string) => Promise<Tag | null>
    getAll: () => Promise<Tag[]>
    update: (id: string, data: UpdateTagRequest) => Promise<Tag>
    softDelete: (id: string) => Promise<void>
  }
  project: {
    create: (data: CreateProjectRequest) => Promise<Project>
    get: (id: string) => Promise<Project | null>
    getAll: () => Promise<Project[]>
    update: (id: string, data: UpdateProjectRequest) => Promise<Project>
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
