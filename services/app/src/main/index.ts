import { app, BrowserWindow } from 'electron'
import { openDB } from './db'
import { TaskRepository } from './repository/taskRepository'
import {
  registerTaskHandlers,
  registerTaskNoteHandlers,
  registerTagHandlers,
  registerProjectHandlers,
  registerWeeklyReflectionHandlers,
  registerTaskTypeHandlers,
  registerCrashReportHandlers
} from './ipc/ipcHandlers'
import { NoteService } from './service/NoteService'
import { NoteRepository } from './repository/noteRepository'
import { TagRepository } from './repository/tagRepository'
import { GeminiService } from './service/GeminiService'
import { ReflectionRepository } from './repository/reflectionRepository'
import { ProjectRepository } from './repository/projectRepository'
import { WeeklyReflectionRepository } from './repository/weeklyReflectionRepository'
import { installExtension, REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import { TaskTypeRepository } from './repository/taskTypeRepository'
import { CrashReportRepository } from './repository/crashReportRepository'
import { CrashReportService, initSentryEarly } from './service/CrashReportService'
import { createWindow } from './window'
import { isDev } from '../config/env'

initSentryEarly()

let crashReportServiceInstance: CrashReportService | null = null
let mainWindow: BrowserWindow | null = null

app.whenReady().then(() => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY in environment variables')
  }

  if (isDev) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((ext) => console.log(`Added Extension:  ${ext.name}`))
      .catch((err) => console.log('An error occurred: ', err))
  }

  const { db } = openDB()

  const crashReportRepo = new CrashReportRepository(db)
  const crashReportService = new CrashReportService(crashReportRepo)
  crashReportService.applySettings()
  registerCrashReportHandlers(crashReportService)
  crashReportServiceInstance = crashReportService

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

  const taskTypeRepo = new TaskTypeRepository(db)
  registerTaskTypeHandlers(taskTypeRepo)

  mainWindow = createWindow()

  // TODO: need to consider theme change handling (dark mode, light mode, system mode)
  // nativeTheme.on('updated', () => {
  //   const isDark = nativeTheme.shouldUseDarkColors
  //   mainWindow.webContents.send('theme.changed', isDark)
  // })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // NOTE: For macOS, re-create a window in the app when the dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      mainWindow = createWindow()
      mainWindow.on('ready-to-show', () => {
        mainWindow?.show()
      })
      mainWindow.on('closed', () => {
        mainWindow = null
      })
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', async () => {
  if (crashReportServiceInstance) {
    await crashReportServiceInstance.shutdown()
  }
})
