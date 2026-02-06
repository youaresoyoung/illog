import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import type * as schema from '../database/schema'
import {
  registerCrashReportHandlers,
  registerTaskHandlers,
  registerTaskNoteHandlers,
  registerTagHandlers,
  registerProjectHandlers,
  registerWeeklyReflectionHandlers,
  registerTaskTypeHandlers,
  registerUserHandlers
} from '../ipc/ipcHandlers'
import {
  CrashReportRepository,
  TaskRepository,
  ReflectionRepository,
  NoteRepository,
  TagRepository,
  ProjectRepository,
  WeeklyReflectionRepository,
  TaskTypeRepository
} from '../repository'
import { CrashReportService } from '../service/CrashReportService'
import { GeminiService } from '../service/GeminiService'
import { NoteService } from '../service/NoteService'
import { config } from '../../config/env'
import { UserService } from '../service/UserService'

export function registerHandlers(db: BetterSQLite3Database<typeof schema>): CrashReportService {
  const crashReportRepo = new CrashReportRepository(db)
  const crashReportService = new CrashReportService(crashReportRepo)
  crashReportService.applySettings()
  registerCrashReportHandlers(crashReportService)

  const taskRepo = new TaskRepository(db)
  registerTaskHandlers(taskRepo)

  const userService = new UserService()
  registerUserHandlers(userService)

  const geminiService = new GeminiService(config.geminiApiKey)
  const reflectionRepo = new ReflectionRepository(db)
  const noteRepo = new NoteRepository(db)
  const noteService = new NoteService(noteRepo, reflectionRepo, geminiService, userService)
  registerTaskNoteHandlers(noteRepo, noteService)

  const tagRepo = new TagRepository(db)
  registerTagHandlers(tagRepo)

  const projectRepo = new ProjectRepository(db)
  registerProjectHandlers(projectRepo)

  const weeklyReflectionRepo = new WeeklyReflectionRepository(db)
  registerWeeklyReflectionHandlers(weeklyReflectionRepo)

  const taskTypeRepo = new TaskTypeRepository(db)
  registerTaskTypeHandlers(taskTypeRepo)

  return crashReportService
}
