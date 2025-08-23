import { contextBridge, ipcRenderer } from 'electron'
import { Task } from '../types'

const api = {
  task: {
    create: (task: Partial<Task>) => ipcRenderer.invoke('task.create', task),
    get: (id: string) => ipcRenderer.invoke('task.get', id),
    getAll: () => ipcRenderer.invoke('task.getAll'),
    update: (id: string, contents: Partial<Task>) =>
      ipcRenderer.invoke('task.update', id, contents),
    softDelete: (id: string) => ipcRenderer.invoke('task.softDelete', id)
  }
}

contextBridge.exposeInMainWorld('api', api)
