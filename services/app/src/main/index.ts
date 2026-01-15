import { app, BrowserWindow, nativeTheme } from 'electron'
import { openDB } from './db'
import { join } from 'path'
import { TaskRepository } from './repository/taskRepository'
import { isDev } from '../utils/utils'
import {
  registerTaskHandlers,
  registerTaskNoteHandlers,
  registerTagHandlers,
  registerProjectHandlers,
  registerWeeklyReflectionHandlers
} from './ipc/ipcHandlers'
import { NoteService } from './service/NoteService'
import { NoteRepository } from './repository/noteRepository'
import { TagRepository } from './repository/tagRepository'
import { GeminiService } from './service/GeminiService'
import dotenv from 'dotenv'
import { ReflectionRepository } from './repository/reflectionRepository'
import { ProjectRepository } from './repository/projectRepository'
import { WeeklyReflectionRepository } from './repository/weeklyReflectionRepository'

dotenv.config()

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

  return mainWindow
}

app.whenReady().then(() => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY in environment variables')
  }

  const { db } = openDB()

  const taskRepo = new TaskRepository(db)
  registerTaskHandlers(taskRepo)

  const geminiService = new GeminiService(process.env.GEMINI_API_KEY)
  const reflectionRepo = new ReflectionRepository(db)
  const noteRepo = new NoteRepository(db)
  const noteService = new NoteService(noteRepo, reflectionRepo, geminiService)
  registerTaskNoteHandlers(noteRepo, noteService)

  const tagRepo = new TagRepository(db)
  registerTagHandlers(tagRepo)

  const projectRepo = new ProjectRepository(db)
  registerProjectHandlers(projectRepo)

  const weeklyReflectionRepo = new WeeklyReflectionRepository(db)
  registerWeeklyReflectionHandlers(weeklyReflectionRepo)

  const mainWindow = createWindow()

  nativeTheme.on('updated', () => {
    const isDark = nativeTheme.shouldUseDarkColors
    mainWindow.webContents.send('theme.changed', isDark)
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
