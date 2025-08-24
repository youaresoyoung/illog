import { app, BrowserWindow, ipcMain } from 'electron'
import { openDB } from './db'
import { join } from 'path'
import { TaskRepository } from './repository/taskRepository'
import { isDev } from '../utils/utils'

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      sandbox: true,
      preload: join(__dirname, '../preload/index.js')
    }
  })

  if (isDev()) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  const db = openDB()

  const taskRepo = new TaskRepository(db)

  ipcMain.handle('task.create', (event, task) => {
    const createdTask = taskRepo.create(task)
    return createdTask
  })

  ipcMain.handle('task.get', (event, id) => {
    const task = taskRepo.get(id)
    return task
  })

  ipcMain.handle('task.getAll', () => {
    const tasks = taskRepo.getAll()

    return tasks
  })

  ipcMain.handle('task.update', (event, id, contents) => {
    const updatedTask = taskRepo.update(id, contents)
    return updatedTask
  })

  ipcMain.handle('task.softDelete', (event, id) => {
    taskRepo.softDelete(id)
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
