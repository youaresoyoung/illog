import { NoteService } from './../service/NoteService'
import { ipcMain } from 'electron'
import { TaskRepository } from '../repository/taskRepository'
import { NoteRepository } from '../repository/noteRepository'

// TODO: error handling
export function registerTaskHandlers(taskRepo: TaskRepository) {
  ipcMain.handle('task.create', (_, task) => taskRepo.create(task))
  ipcMain.handle('task.get', (_, id) => taskRepo.get(id))
  ipcMain.handle('task.getAll', () => taskRepo.getAll())
  ipcMain.handle('task.update', (_, id, contents) => taskRepo.update(id, contents))
  ipcMain.handle('task.softDelete', (_, id) => taskRepo.softDelete(id))
}

export function registerTaskNoteHandlers(noteRepo: NoteRepository, noteService: NoteService) {
  ipcMain.handle('note.findByTaskId', (_, taskId) => noteRepo.findByTaskId(taskId))
  ipcMain.handle('note.autoSave', (_, taskId, content, clientUpdatedAt) =>
    noteService.autoSave(taskId, content, clientUpdatedAt)
  )
}
