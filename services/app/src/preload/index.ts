import { contextBridge, ipcRenderer } from 'electron'
import type {
  TaskFilterParams,
  UpdateTaskRequest,
  CreateTagRequest,
  UpdateTagRequest,
  CreateProjectRequest,
  UpdateProjectRequest,
  UpdateWeeklyReflectionRequest,
  CreateTaskTypeRequest,
  UpdateTaskTypeRequest,
  CreateTaskSubtypeRequest,
  UpdateTaskSubtypeRequest,
  UpdateCrashReportSettingsRequest,
  FeatureId
} from '../shared/types'

const api = {
  task: {
    create: () => ipcRenderer.invoke('task.create'),
    get: (id: string) => ipcRenderer.invoke('task.get', id),
    getWithTags: (id: string) => ipcRenderer.invoke('task.getWithTags', id),
    getTasksWithTags: (filters?: TaskFilterParams) =>
      ipcRenderer.invoke('task.getTasksWithTags', filters),
    update: (id: string, data: UpdateTaskRequest) => ipcRenderer.invoke('task.update', id, data),
    addTag: (taskId: string, tagId: string) => ipcRenderer.invoke('task.addTag', taskId, tagId),
    softDelete: (id: string) => ipcRenderer.invoke('task.softDelete', id),
    removeTag: (taskId: string, tagId: string) =>
      ipcRenderer.invoke('task.removeTag', taskId, tagId)
  },
  note: {
    findByTaskId: (taskId: string) => ipcRenderer.invoke('note.findByTaskId', taskId),
    autoSave: (taskId: string, content: string, clientUpdatedAt: number) =>
      ipcRenderer.invoke('note.autoSave', taskId, content, clientUpdatedAt),
    reflectionNoteStream: (
      taskId: string,
      text: string,
      callback: (data: { chunk: string; done: boolean }) => void
    ) => {
      ipcRenderer.on('note.reflectionNoteStreamChunk', (_event, data) => {
        callback(data)
      })
      return ipcRenderer.invoke('note.reflectionNoteStream', taskId, text)
    },
    removeReflectionListener: () => ipcRenderer.invoke('note.removeReflectionListener'),
    getReflection: (taskId: string) => ipcRenderer.invoke('note.getReflection', taskId),
    deleteReflection: (taskId: string) => ipcRenderer.invoke('note.deleteReflection', taskId)
  },
  tag: {
    create: (data: CreateTagRequest) => ipcRenderer.invoke('tag.create', data),
    get: (id: string) => ipcRenderer.invoke('tag.get', id),
    getAll: () => ipcRenderer.invoke('tag.getAll'),
    update: (id: string, data: UpdateTagRequest) => ipcRenderer.invoke('tag.update', id, data),
    softDelete: (id: string) => ipcRenderer.invoke('tag.softDelete', id)
  },
  project: {
    create: (data: CreateProjectRequest) => ipcRenderer.invoke('project.create', data),
    get: (id: string) => ipcRenderer.invoke('project.get', id),
    getAll: () => ipcRenderer.invoke('project.getAll'),
    update: (id: string, data: UpdateProjectRequest) =>
      ipcRenderer.invoke('project.update', id, data),
    softDelete: (id: string) => ipcRenderer.invoke('project.softDelete', id)
  },
  weeklyReflection: {
    get: (weekId: string) => ipcRenderer.invoke('weeklyReflection.get', weekId),
    upsert: (weekId: string, data: UpdateWeeklyReflectionRequest) =>
      ipcRenderer.invoke('weeklyReflection.upsert', weekId, data)
  },
  taskType: {
    getAll: () => ipcRenderer.invoke('taskType.getAll'),
    getAllWithSubtypes: () => ipcRenderer.invoke('taskType.getAllWithSubtypes'),
    get: (id: string) => ipcRenderer.invoke('taskType.get', id),
    create: (data: CreateTaskTypeRequest) => ipcRenderer.invoke('taskType.create', data),
    update: (id: string, data: UpdateTaskTypeRequest) =>
      ipcRenderer.invoke('taskType.update', id, data),
    softDelete: (id: string) => ipcRenderer.invoke('taskType.softDelete', id)
  },
  taskSubtype: {
    getAllByTypeId: (typeId: string) => ipcRenderer.invoke('taskSubtype.getAllByTypeId', typeId),
    get: (id: string) => ipcRenderer.invoke('taskSubtype.get', id),
    create: (data: CreateTaskSubtypeRequest) => ipcRenderer.invoke('taskSubtype.create', data),
    update: (id: string, data: UpdateTaskSubtypeRequest) =>
      ipcRenderer.invoke('taskSubtype.update', id, data),
    softDelete: (id: string) => ipcRenderer.invoke('taskSubtype.softDelete', id)
  },
  crashReport: {
    getSettings: () => ipcRenderer.invoke('crashReport.getSettings'),
    updateSettings: (data: UpdateCrashReportSettingsRequest) =>
      ipcRenderer.invoke('crashReport.updateSettings', data),
    sendReport: (error: { message: string; stack?: string }) =>
      ipcRenderer.invoke('crashReport.sendReport', error),
    isOnboardingCompleted: () => ipcRenderer.invoke('crashReport.isOnboardingCompleted'),
    completeOnboarding: () => ipcRenderer.invoke('crashReport.completeOnboarding')
  },
  user: {
    getPlanInfo: () => ipcRenderer.invoke('user.getPlanInfo'),
    isFeatureEnabled: (featureId: FeatureId) =>
      ipcRenderer.invoke('user.isFeatureEnabled', featureId)
  }
}

const theme = {
  onChange: (cb: (isDark: boolean) => void) => {
    ipcRenderer.on('theme.changed', (_event, isDark) => {
      cb(isDark)
    })
  }
}

contextBridge.exposeInMainWorld('api', api)
contextBridge.exposeInMainWorld('theme', theme)
