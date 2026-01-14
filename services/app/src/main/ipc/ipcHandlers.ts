import { ipcMain } from 'electron'
import { NoteService } from '../service/NoteService'
import { TaskRepository } from '../repository/taskRepository'
import { NoteRepository } from '../repository/noteRepository'
import { TagRepository } from '../repository/tagRepository'
import { ProjectRepository } from '../repository/projectRepository'

import type {
  TaskFilterParams,
  UpdateTaskRequest,
  CreateTagRequest,
  UpdateTagRequest,
  CreateProjectRequest,
  UpdateProjectRequest
} from '../../shared/types'

// TODO: add proper error handling wrapper

export function registerTaskHandlers(taskRepo: TaskRepository) {
  ipcMain.handle('task.create', () => taskRepo.create())
  ipcMain.handle('task.get', (_, id: string) => taskRepo.get(id))
  ipcMain.handle('task.getWithTags', (_, id: string) => taskRepo.getWithTags(id))
  ipcMain.handle('task.getTasksWithTags', (_, filters?: TaskFilterParams) =>
    taskRepo.getTasksWithTags(filters)
  )
  ipcMain.handle('task.update', (_, id: string, data: UpdateTaskRequest) =>
    taskRepo.update(id, data)
  )
  ipcMain.handle('task.addTag', (_, taskId: string, tagId: string) =>
    taskRepo.addTag(taskId, tagId)
  )
  ipcMain.handle('task.softDelete', (_, id: string) => taskRepo.softDelete(id))
  ipcMain.handle('task.removeTag', (_, taskId: string, tagId: string) =>
    taskRepo.removeTag(taskId, tagId)
  )
}

export function registerTaskNoteHandlers(noteRepo: NoteRepository, noteService: NoteService) {
  ipcMain.handle('note.findByTaskId', (_, taskId: string) => noteRepo.findByTaskId(taskId))
  ipcMain.handle('note.autoSave', (_, taskId: string, content: string, clientUpdatedAt: number) =>
    noteService.autoSave(taskId, content, clientUpdatedAt)
  )
  ipcMain.handle('note.reflectionNoteStream', async (event, taskId: string, text: string) => {
    const stream = noteService.reflectionNoteStream(taskId, text)
    for await (const data of stream) {
      event.sender.send('note.reflectionNoteStreamChunk', data)
    }
  })
  ipcMain.handle('note.getReflection', (_, taskId: string) => noteService.getReflection(taskId))
  ipcMain.handle('note.deleteReflection', (_, taskId: string) =>
    noteService.deleteReflection(taskId)
  )
  ipcMain.handle('note.removeReflectionListener', (event) => {
    event.sender.removeAllListeners('note.reflectionNoteStreamChunk')
  })
}

export function registerTagHandlers(tagRepo: TagRepository) {
  ipcMain.handle('tag.create', (_, data: CreateTagRequest) => tagRepo.create(data))
  ipcMain.handle('tag.get', (_, id: string) => tagRepo.get(id))
  ipcMain.handle('tag.getAll', () => tagRepo.getAll())
  ipcMain.handle('tag.update', (_, id: string, data: UpdateTagRequest) => tagRepo.update(id, data))
  ipcMain.handle('tag.softDelete', (_, id: string) => tagRepo.softDelete(id))
}

export function registerProjectHandlers(projectRepo: ProjectRepository) {
  ipcMain.handle('project.create', (_, data: CreateProjectRequest) => projectRepo.create(data))
  ipcMain.handle('project.get', (_, id: string) => projectRepo.get(id))
  ipcMain.handle('project.getAll', () => projectRepo.getAll())
  ipcMain.handle('project.update', (_, id: string, data: UpdateProjectRequest) =>
    projectRepo.update(id, data)
  )
  ipcMain.handle('project.softDelete', (_, id: string) => projectRepo.softDelete(id))
}
