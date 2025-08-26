import { app, BrowserWindow } from 'electron'
import { openDB } from './db'
import { join } from 'path'
import { TaskRepository } from './repository/taskRepository'
import { isDev } from '../utils/utils'
import { registerTaskHandlers, registerTaskNoteHandlers } from './ipc/ipcHandlers'
import { NoteService } from './service/NoteService'
import { NoteRepository } from './repository/noteRepository'

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
  registerTaskHandlers(taskRepo)

  const noteRepo = new NoteRepository(db)
  const noteService = new NoteService(noteRepo)
  registerTaskNoteHandlers(noteRepo, noteService)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
