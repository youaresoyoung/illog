import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TaskNote } from '../../types'
import { queryKeys } from './queryKeys'
import { useCallback, useState } from 'react'
import { getUserMessage } from '../../../../shared/errors'
import { useToastStore } from '../../stores/useToastStore'
import { REFLECTION_GENERATED } from '@illog/analytics'

export const useTaskNote = (taskId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.notes.byTaskId(taskId!),
    queryFn: async () => {
      const result = await window.api.note.findByTaskId(taskId!)
      return result ?? null
    },
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
    meta: { errorMessage: 'Note failed to save' },
    onSuccess: (result, { taskId }) => {
      if (result?.note) {
        queryClient.setQueryData<TaskNote>(queryKeys.notes.byTaskId(taskId), result.note)
      }
    }
  })
}

export const useReflection = (taskId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.reflections.byTaskId(taskId!),
    queryFn: async () => {
      const result = await window.api.note.getReflection(taskId!)
      return result ?? null
    },
    enabled: !!taskId
  })
}

export const useReflectionStream = () => {
  const queryClient = useQueryClient()
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamedContent, setStreamedContent] = useState('')

  const generateReflection = useCallback(
    async (taskId: string, noteContent: string) => {
      setIsStreaming(true)
      setStreamedContent('')
      try {
        await window.api.note.reflectionNoteStream(taskId, noteContent, (data) => {
          if (data.done) {
            setIsStreaming(false)
            queryClient.invalidateQueries({ queryKey: queryKeys.reflections.byTaskId(taskId) })
            window.api?.analytics?.track(REFLECTION_GENERATED)
          } else {
            setStreamedContent((prev) => prev + data.chunk)
          }
        })
      } catch (error) {
        // Manual toast: reflectionNoteStream is not a react-query mutation,
        // so the global MutationCache.onError handler does not apply here.
        const message = getUserMessage(error)
        useToastStore.getState().addToast({ type: 'error', message })
        setIsStreaming(false)
      }

      return () => {
        window.api.note.removeReflectionListener()
      }
    },
    [queryClient]
  )

  return {
    generateReflection,
    isStreaming,
    streamedContent,
    resetStream: () => {
      setIsStreaming(false)
      setStreamedContent('')
    }
  }
}
