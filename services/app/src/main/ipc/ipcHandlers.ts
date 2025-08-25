import { ipcMain } from 'electron'
import { TaskRepository } from '../repository/taskRepository'

// TODO: error handling
export function registerTaskHandlers(taskRepo: TaskRepository) {
  ipcMain.handle('task.create', (_, task) => taskRepo.create(task))
  ipcMain.handle('task.get', (_, id) => taskRepo.get(id))
  ipcMain.handle('task.getAll', () => taskRepo.getAll())
  ipcMain.handle('task.update', (_, id, contents) => taskRepo.update(id, contents))
  ipcMain.handle('task.softDelete', (_, id) => taskRepo.softDelete(id))
}
