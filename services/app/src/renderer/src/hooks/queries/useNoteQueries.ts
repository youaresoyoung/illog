import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TaskNote } from '../../../../types'
import { queryKeys } from './queryKeys'

export const useTaskNote = (taskId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.notes.byTaskId(taskId!),
    queryFn: () => window.api.note.findByTaskId(taskId!),
    enabled: !!taskId
  })
}

export const useAutoSaveNote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      taskId,
      content,
      clientUpdatedAt
    }: {
      taskId: string
      content: string
      clientUpdatedAt: number
    }) => window.api.note.autoSave(taskId, content, clientUpdatedAt),
    onSuccess: (result, { taskId }) => {
      if (result?.note) {
        queryClient.setQueryData<TaskNote>(queryKeys.notes.byTaskId(taskId), result.note)
      }
    }
  })
}
