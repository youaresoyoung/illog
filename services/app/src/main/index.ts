import { app, BrowserWindow, ipcMain } from 'electron'
import { openDB } from './db'
import { join } from 'path'
import { TaskRepository } from './repository/taskRepository'
import { existsSync, unlinkSync } from 'fs'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      sandbox: true,
      preload: join(__dirname, '../preload/index.js')
    }
  })

  mainWindow.loadURL('http://localhost:5173')
  // mainWindow.loadURL(join(app.getAppPath(), '/dist/renderer/index.html'))
}

app.whenReady().then(() => {
  createWindow()

  const db = openDB()

  const taskRepo = new TaskRepository(db)

  ipcMain.handle('task.create', async (event, task) => {
    const createdTask = taskRepo.create(task)
    return createdTask
  })

  ipcMain.handle('task.get', async (event, id) => {
    const task = taskRepo.get(id)
    return task
  })

  ipcMain.handle('task.getAll', async () => {
    const tasks = taskRepo.getAll()

    return tasks
  })

  ipcMain.handle('task.update', async (event, id, contents) => {
    const updatedTask = taskRepo.update(id, contents)
    return updatedTask
  })

  ipcMain.handle('task.softDelete', async (event, id) => {
    taskRepo.softDelete(id)
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
