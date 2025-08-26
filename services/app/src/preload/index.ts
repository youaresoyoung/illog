import { contextBridge, ipcRenderer } from 'electron'
import { Tag, Task } from '../types'

const api = {
  task: {
    create: (task: Partial<Task>) => ipcRenderer.invoke('task.create', task),
    get: (id: string) => ipcRenderer.invoke('task.get', id),
    getAll: () => ipcRenderer.invoke('task.getAll'),
    update: (id: string, contents: Partial<Task>) =>
      ipcRenderer.invoke('task.update', id, contents),
    softDelete: (id: string) => ipcRenderer.invoke('task.softDelete', id)
  },
  note: {
    findByTaskId: (taskId: string) => ipcRenderer.invoke('note.findByTaskId', taskId),
    autoSave: (taskId: string, content: string, clientUpdatedAt: number) =>
      ipcRenderer.invoke('note.autoSave', taskId, content, clientUpdatedAt)
  },
  tag: {
    create: (tag: Partial<Tag>) => ipcRenderer.invoke('tag.create', tag),
    get: (id: string) => ipcRenderer.invoke('tag.getAll', id),
    getAll: () => ipcRenderer.invoke('tag.getAll'),
    update: (id: string, contents: Partial<Tag>) => ipcRenderer.invoke('tag.update', id, contents),
    softDelete: (id: string) => ipcRenderer.invoke('tag.softDelete', id)
  }
}

contextBridge.exposeInMainWorld('api', api)
