import { ipcMain, IpcMainInvokeEvent } from 'electron'
import * as Sentry from '@sentry/electron/main'
import { NoteService } from '../service/NoteService'
import { TaskRepository } from '../repository/taskRepository'
import { NoteRepository } from '../repository/noteRepository'
import { TagRepository } from '../repository/tagRepository'
import { ProjectRepository } from '../repository/projectRepository'
import { WeeklyReflectionRepository } from '../repository/weeklyReflectionRepository'
import type {
  TaskFilterParams,
  UpdateTaskRequest,
  CreateTagRequest,
  UpdateTagRequest,
  CreateProjectRequest,
  UpdateProjectRequest,
  UpdateWeeklyReflectionRequest,
  UpdateCrashReportSettingsRequest,
  FeatureId
} from '../../shared/types'
import { TaskTypeRepository } from '../repository/taskTypeRepository'
import {
  CreateTaskSubtypeRequest,
  CreateTaskTypeRequest,
  UpdateTaskSubtypeRequest,
  UpdateTaskTypeRequest
} from '../../shared/types/taskTypeDto'
import { CrashReportService } from '../service/CrashReportService'
import { UserService } from '../service/UserService'
import { serializeError } from '../../shared/errors'

let crashReportServiceRef: CrashReportService | null = null

export function setCrashReportService(service: CrashReportService) {
  crashReportServiceRef = service
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- IPC args are dynamically typed from renderer
function safeHandle(channel: string, handler: (event: IpcMainInvokeEvent, ...args: any[]) => any) {
  ipcMain.handle(channel, async (event, ...args) => {
    try {
      return await handler(event, ...args)
    } catch (error) {
      if (crashReportServiceRef?.isActive()) {
        Sentry.captureException(error, {
          tags: { ipc_channel: channel },
          extra: { args: args.map(() => '[redacted]') }
        })
      }
      const serialized = serializeError(error)
      throw new Error(`__APP_ERROR__${JSON.stringify(serialized)}`)
    }
  })
}

export function registerTaskHandlers(taskRepo: TaskRepository) {
  safeHandle('task.create', () => taskRepo.create())
  safeHandle('task.get', (_, id: string) => taskRepo.get(id))
  safeHandle('task.getWithTags', (_, id: string) => taskRepo.getWithTags(id))
  safeHandle('task.getTasksWithTags', (_, filters?: TaskFilterParams) =>
    taskRepo.getTasksWithTags(filters)
  )
  safeHandle('task.update', (_, id: string, data: UpdateTaskRequest) => taskRepo.update(id, data))
  safeHandle('task.addTag', (_, taskId: string, tagId: string) => taskRepo.addTag(taskId, tagId))
  safeHandle('task.softDelete', (_, id: string) => taskRepo.softDelete(id))
  safeHandle('task.removeTag', (_, taskId: string, tagId: string) =>
    taskRepo.removeTag(taskId, tagId)
  )
}

export function registerTaskNoteHandlers(noteRepo: NoteRepository, noteService: NoteService) {
  safeHandle('note.findByTaskId', (_, taskId: string) => noteRepo.findByTaskId(taskId))
  safeHandle('note.autoSave', (_, taskId: string, content: string, clientUpdatedAt: number) =>
    noteService.autoSave(taskId, content, clientUpdatedAt)
  )
  safeHandle('note.reflectionNoteStream', async (event, taskId: string, text: string) => {
    const stream = noteService.reflectionNoteStream(taskId, text)
    for await (const data of stream) {
      event.sender.send('note.reflectionNoteStreamChunk', data)
    }
  })
  safeHandle('note.getReflection', (_, taskId: string) => noteService.getReflection(taskId))
  safeHandle('note.deleteReflection', (_, taskId: string) => noteService.deleteReflection(taskId))
  safeHandle('note.removeReflectionListener', (event) => {
    event.sender.removeAllListeners('note.reflectionNoteStreamChunk')
  })
}

export function registerTagHandlers(tagRepo: TagRepository) {
  safeHandle('tag.create', (_, data: CreateTagRequest) => tagRepo.create(data))
  safeHandle('tag.get', (_, id: string) => tagRepo.get(id))
  safeHandle('tag.getAll', () => tagRepo.getAll())
  safeHandle('tag.update', (_, id: string, data: UpdateTagRequest) => tagRepo.update(id, data))
  safeHandle('tag.softDelete', (_, id: string) => tagRepo.softDelete(id))
}

export function registerProjectHandlers(projectRepo: ProjectRepository) {
  safeHandle('project.create', (_, data: CreateProjectRequest) => projectRepo.create(data))
  safeHandle('project.get', (_, id: string) => projectRepo.get(id))
  safeHandle('project.getAll', () => projectRepo.getAll())
  safeHandle('project.update', (_, id: string, data: UpdateProjectRequest) =>
    projectRepo.update(id, data)
  )
  safeHandle('project.softDelete', (_, id: string) => projectRepo.softDelete(id))
}

export function registerWeeklyReflectionHandlers(repo: WeeklyReflectionRepository) {
  safeHandle('weeklyReflection.get', (_, weekId: string) => repo.findByWeekId(weekId))
  safeHandle('weeklyReflection.upsert', (_, weekId: string, data: UpdateWeeklyReflectionRequest) =>
    repo.upsert(weekId, data)
  )
}

export function registerTaskTypeHandlers(repo: TaskTypeRepository) {
  safeHandle('taskType.create', (_, data: CreateTaskTypeRequest) => repo.create(data))
  safeHandle('taskType.get', (_, id: string) => repo.get(id))
  safeHandle('taskType.getAll', () => repo.getAll())
  safeHandle('taskType.getAllWithSubtypes', () => repo.getAllWithSubtypes())
  safeHandle('taskType.update', (_, id: string, data: UpdateTaskTypeRequest) =>
    repo.update(id, data)
  )
  safeHandle('taskType.softDelete', (_, id: string) => repo.softDelete(id))

  // Task subtype handlers
  safeHandle('taskSubtype.getAllByTypeId', (_, typeId: string) => repo.getSubtypes(typeId))
  safeHandle('taskSubtype.get', (_, id: string) => repo.getSubtype(id))
  safeHandle('taskSubtype.create', (_, data: CreateTaskSubtypeRequest) => repo.createSubtype(data))
  safeHandle('taskSubtype.update', (_, id: string, data: UpdateTaskSubtypeRequest) =>
    repo.updateSubtype(id, data)
  )
  safeHandle('taskSubtype.softDelete', (_, id: string) => repo.softDeleteSubtype(id))
}

// Uses raw ipcMain.handle intentionally to avoid circular error reporting
export function registerCrashReportHandlers(crashReportService: CrashReportService) {
  ipcMain.handle('crashReport.getSettings', () => crashReportService.getSettings())
  ipcMain.handle('crashReport.updateSettings', (_, data: UpdateCrashReportSettingsRequest) =>
    crashReportService.updateSettings(data.enabled)
  )
  ipcMain.handle('crashReport.sendReport', (_, error: { message: string; stack?: string }) => {
    crashReportService.sendCrashReport(error)
  })
  ipcMain.handle('crashReport.isOnboardingCompleted', () =>
    crashReportService.isOnboardingCompleted()
  )
  ipcMain.handle('crashReport.completeOnboarding', () => crashReportService.completeOnboarding())
}

export function registerUserHandlers(userService: UserService) {
  safeHandle('user.getPlanInfo', () => userService.getUserPlanInfo())
  safeHandle('user.isFeatureEnabled', (_, featureId: FeatureId) =>
    userService.isFeatureEnabled(featureId)
  )
}
