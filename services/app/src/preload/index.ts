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

const APP_ERROR_DELIMITER = '__APP_ERROR__'

async function safeInvoke(channel: string, ...args: unknown[]) {
  try {
    return await ipcRenderer.invoke(channel, ...args)
  } catch (error) {
    if (error instanceof Error) {
      const idx = error.message.indexOf(APP_ERROR_DELIMITER)
      if (idx !== -1) {
        try {
          const parsed = JSON.parse(error.message.slice(idx + APP_ERROR_DELIMITER.length))
          if (parsed?.__appError) {
            const appError = new Error(parsed.message) as Error & { code: string }
            appError.code = parsed.code
            appError.name = 'AppError'
            throw appError
          }
        } catch (parseError) {
          if (parseError instanceof Error && parseError.name === 'AppError') throw parseError
        }
      }
    }
    throw error
  }
}

const api = {
  task: {
    create: () => safeInvoke('task.create'),
    get: (id: string) => safeInvoke('task.get', id),
    getWithTags: (id: string) => safeInvoke('task.getWithTags', id),
    getTasksWithTags: (filters?: TaskFilterParams) => safeInvoke('task.getTasksWithTags', filters),
    update: (id: string, data: UpdateTaskRequest) => safeInvoke('task.update', id, data),
    addTag: (taskId: string, tagId: string) => safeInvoke('task.addTag', taskId, tagId),
    softDelete: (id: string) => safeInvoke('task.softDelete', id),
    removeTag: (taskId: string, tagId: string) => safeInvoke('task.removeTag', taskId, tagId)
  },
  note: {
    findByTaskId: (taskId: string) => safeInvoke('note.findByTaskId', taskId),
    autoSave: (taskId: string, content: string, clientUpdatedAt: number) =>
      safeInvoke('note.autoSave', taskId, content, clientUpdatedAt),
    reflectionNoteStream: (
      taskId: string,
      text: string,
      callback: (data: { chunk: string; done: boolean }) => void
    ) => {
      ipcRenderer.removeAllListeners('note.reflectionNoteStreamChunk')
      ipcRenderer.on('note.reflectionNoteStreamChunk', (_event, data) => {
        callback(data)
      })
      return safeInvoke('note.reflectionNoteStream', taskId, text)
    },
    removeReflectionListener: () => safeInvoke('note.removeReflectionListener'),
    getReflection: (taskId: string) => safeInvoke('note.getReflection', taskId),
    deleteReflection: (taskId: string) => safeInvoke('note.deleteReflection', taskId)
  },
  tag: {
    create: (data: CreateTagRequest) => safeInvoke('tag.create', data),
    get: (id: string) => safeInvoke('tag.get', id),
    getAll: () => safeInvoke('tag.getAll'),
    update: (id: string, data: UpdateTagRequest) => safeInvoke('tag.update', id, data),
    softDelete: (id: string) => safeInvoke('tag.softDelete', id)
  },
  project: {
    create: (data: CreateProjectRequest) => safeInvoke('project.create', data),
    get: (id: string) => safeInvoke('project.get', id),
    getAll: () => safeInvoke('project.getAll'),
    update: (id: string, data: UpdateProjectRequest) => safeInvoke('project.update', id, data),
    softDelete: (id: string) => safeInvoke('project.softDelete', id)
  },
  weeklyReflection: {
    get: (weekId: string) => safeInvoke('weeklyReflection.get', weekId),
    upsert: (weekId: string, data: UpdateWeeklyReflectionRequest) =>
      safeInvoke('weeklyReflection.upsert', weekId, data)
  },
  taskType: {
    getAll: () => safeInvoke('taskType.getAll'),
    getAllWithSubtypes: () => safeInvoke('taskType.getAllWithSubtypes'),
    get: (id: string) => safeInvoke('taskType.get', id),
    create: (data: CreateTaskTypeRequest) => safeInvoke('taskType.create', data),
    update: (id: string, data: UpdateTaskTypeRequest) => safeInvoke('taskType.update', id, data),
    softDelete: (id: string) => safeInvoke('taskType.softDelete', id)
  },
  taskSubtype: {
    getAllByTypeId: (typeId: string) => safeInvoke('taskSubtype.getAllByTypeId', typeId),
    get: (id: string) => safeInvoke('taskSubtype.get', id),
    create: (data: CreateTaskSubtypeRequest) => safeInvoke('taskSubtype.create', data),
    update: (id: string, data: UpdateTaskSubtypeRequest) =>
      safeInvoke('taskSubtype.update', id, data),
    softDelete: (id: string) => safeInvoke('taskSubtype.softDelete', id)
  },
  // crashReport uses raw ipcRenderer.invoke intentionally to avoid circular error reporting
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
    getPlanInfo: () => safeInvoke('user.getPlanInfo'),
    isFeatureEnabled: (featureId: FeatureId) => safeInvoke('user.isFeatureEnabled', featureId)
  },
  analytics: {
    track: (eventName: string, data?: Record<string, string | number | boolean>) =>
      safeInvoke('analytics.track', eventName, data),
    pageView: (url: string, title?: string) => safeInvoke('analytics.pageView', url, title)
  },
  events: {
    onDeepLink: (cb: (url: string) => void): (() => void) => {
      if (typeof cb !== 'function') {
        return () => {}
      }
      const listener = (_event: Electron.IpcRendererEvent, url: string) => {
        try {
          cb(url)
        } catch (e) {
          console.warn('[preload] deep-link cb failed', e)
        }
      }
      ipcRenderer.on('deep-link', listener)
      return () => ipcRenderer.removeListener('deep-link', listener)
    },
    onUpdateAvailable: (cb: () => void): (() => void) => {
      if (typeof cb !== 'function') {
        return () => {}
      }
      const listener = () => {
        try {
          cb()
        } catch (e) {
          console.warn('[preload] update-available cb failed', e)
        }
      }
      ipcRenderer.on('update-available', listener)
      return () => ipcRenderer.removeListener('update-available', listener)
    },
    onUpdateDownloaded: (
      cb: (info: { releaseNotes?: string; releaseName?: string }) => void
    ): (() => void) => {
      if (typeof cb !== 'function') {
        return () => {}
      }
      const listener = (
        _event: Electron.IpcRendererEvent,
        info: { releaseNotes?: string; releaseName?: string }
      ) => {
        try {
          cb(info)
        } catch (e) {
          console.warn('[preload] update-downloaded cb failed', e)
        }
      }
      ipcRenderer.on('update-downloaded', listener)
      return () => ipcRenderer.removeListener('update-downloaded', listener)
    }
  },
  updater: {
    quitAndInstall: (): Promise<void> => ipcRenderer.invoke('updater:quitAndInstall'),
    ...(process.env.NODE_ENV === 'development'
      ? { simulateUpdate: (): Promise<void> => ipcRenderer.invoke('updater:simulateUpdate') }
      : {})
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
