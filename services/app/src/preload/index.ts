import { contextBridge, ipcRenderer } from 'electron'
import { OmittedTag, OmittedTask, TaskFilters } from '../types'

const api = {
  task: {
    create: (task: Partial<OmittedTask>) => ipcRenderer.invoke('task.create', task),
    get: (id: string) => ipcRenderer.invoke('task.get', id),
    getWithTags: (id: string) => ipcRenderer.invoke('task.getWithTags', id),
    getTasks: (filters?: TaskFilters) => ipcRenderer.invoke('task.getTasks', filters),
    getAll: () => ipcRenderer.invoke('task.getAll'),
    update: (id: string, contents: Partial<OmittedTask>) =>
      ipcRenderer.invoke('task.update', id, contents),
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
    create: (tag: Partial<OmittedTag>) => ipcRenderer.invoke('tag.create', tag),
    get: (id: string) => ipcRenderer.invoke('tag.get', id),
    getAll: () => ipcRenderer.invoke('tag.getAll'),
    update: (id: string, contents: Partial<OmittedTag>) =>
      ipcRenderer.invoke('tag.update', id, contents),
    softDelete: (id: string) => ipcRenderer.invoke('tag.softDelete', id)
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
