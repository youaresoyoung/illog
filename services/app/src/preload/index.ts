import { contextBridge, ipcRenderer } from 'electron'
import { OmittedTag, OmittedTask } from '../types'

const api = {
  task: {
    create: (task: Partial<OmittedTask>) => ipcRenderer.invoke('task.create', task),
    get: (id: string) => ipcRenderer.invoke('task.get', id),
    getWithTags: (id: string) => ipcRenderer.invoke('task.getWithTags', id),
    getAll: () => ipcRenderer.invoke('task.getAll'),
    update: (id: string, contents: Partial<OmittedTask>) =>
      ipcRenderer.invoke('task.update', id, contents),
    softDelete: (id: string) => ipcRenderer.invoke('task.softDelete', id)
  },
  note: {
    findByTaskId: (taskId: string) => ipcRenderer.invoke('note.findByTaskId', taskId),
    autoSave: (taskId: string, content: string, clientUpdatedAt: number) =>
      ipcRenderer.invoke('note.autoSave', taskId, content, clientUpdatedAt)
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

contextBridge.exposeInMainWorld('api', api)
