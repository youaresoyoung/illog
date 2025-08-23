import { contextBridge, ipcRenderer } from 'electron'
import { Task } from '../types'

const api = {
  task: {
    create: (task: Partial<Task>) => ipcRenderer.invoke('task.create', task)
  }
}

contextBridge.exposeInMainWorld('api', api)
