import type {
  Task,
  Tag,
  Project,
  TaskType,
  TaskSubtype,
  TaskWithTags,
  TaskNote,
  TaskReflection,
  TaskFilterParams,
  UpdateTaskRequest,
  CreateTagRequest,
  UpdateTagRequest,
  CreateProjectRequest,
  UpdateProjectRequest,
  WeeklyReflectionResponse,
  TaskTypeWithSubtypesDto,
  CreateTaskTypeRequest,
  UpdateTaskTypeRequest,
  CreateTaskSubtypeRequest,
  UpdateTaskSubtypeRequest,
  CrashReportSettings,
  UpdateCrashReportSettingsRequest,
  UserPlanInfo,
  FeatureId
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
  weeklyReflection: {
    get: (weekId: string) => Promise<WeeklyReflectionResponse | null>
    upsert: (weekId: string, content: string) => Promise<WeeklyReflectionResponse>
  }
  taskType: {
    getAll: () => Promise<TaskType[]>
    getAllWithSubtypes: () => Promise<TaskTypeWithSubtypesDto[]>
    get: (id: string) => Promise<TaskType | null>
    create: (data: CreateTaskTypeRequest) => Promise<TaskType>
    update: (id: string, data: UpdateTaskTypeRequest) => Promise<TaskType>
    softDelete: (id: string) => Promise<void>
  }
  taskSubtype: {
    get: (id: string) => Promise<TaskSubtype | null>
    getAllByTypeId: (typeId: string) => Promise<TaskSubtype[]>
    create: (data: CreateTaskSubtypeRequest) => Promise<TaskSubtype>
    update: (id: string, data: UpdateTaskSubtypeRequest) => Promise<TaskSubtype>
    softDelete: (id: string) => Promise<void>
  }
  crashReport: {
    getSettings: () => Promise<CrashReportSettings>
    updateSettings: (data: UpdateCrashReportSettingsRequest) => Promise<CrashReportSettings>
    sendReport: (error: { message: string; stack?: string }) => Promise<void>
    isOnboardingCompleted: () => Promise<boolean>
    completeOnboarding: () => Promise<void>
  }
  user: {
    getPlanInfo: () => Promise<UserPlanInfo>
    isFeatureEnabled: (featureId: FeatureId) => Promise<boolean>
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
