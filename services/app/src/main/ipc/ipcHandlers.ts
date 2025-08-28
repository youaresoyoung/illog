import { NoteService } from './../service/NoteService'
import { ipcMain } from 'electron'
import { TaskRepository } from '../repository/taskRepository'
import { NoteRepository } from '../repository/noteRepository'
import { TagReposity } from '../repository/tagRepository'
import { OmittedTag, OmittedTask } from '../../types'

// TODO: error handling
export function registerTaskHandlers(taskRepo: TaskRepository) {
  ipcMain.handle('task.create', (_, task: Partial<OmittedTask>) => taskRepo.create(task))
  ipcMain.handle('task.get', (_, id: string) => taskRepo.get(id))
  ipcMain.handle('task.getWithTags', (_, id: string) => taskRepo.getWithTags(id))
  ipcMain.handle('task.getAll', () => taskRepo.getAll())
  ipcMain.handle('task.update', (_, id: string, contents: Partial<OmittedTask>) =>
    taskRepo.update(id, contents)
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
  ipcMain.handle('note.findByTaskId', (_, taskId) => noteRepo.findByTaskId(taskId))
  ipcMain.handle('note.autoSave', (_, taskId, content, clientUpdatedAt) =>
    noteService.autoSave(taskId, content, clientUpdatedAt)
  )
}

export function registerTagHandlers(tagRepo: TagReposity) {
  ipcMain.handle('tag.create', (_, tag: Partial<OmittedTag>) => tagRepo.create(tag))
  ipcMain.handle('tag.get', (_, id: string) => tagRepo.get(id))
  ipcMain.handle('tag.getAll', () => tagRepo.getAll())
  ipcMain.handle('tag.update', (_, id: string, contents: Partial<OmittedTag>) =>
    tagRepo.update(id, contents)
  )
  ipcMain.handle('tag.softDelete', (_, id: string) => tagRepo.softDelete(id))
}
