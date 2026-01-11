import type { CreateTagRequest, Tag, UpdateTagRequest } from '../../../../shared/types'
import { queryKeys } from './queryKeys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useAllTags = () => {
  return useQuery({
    queryKey: queryKeys.tags.all,
    queryFn: () => window.api.tag.getAll()
  })
}

export const useTag = (id: string) => {
  return useQuery({
    queryKey: queryKeys.tags.detail(id),
    queryFn: () => window.api.tag.get(id),
    enabled: !!id
  })
}

export const useCreateTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (tag: CreateTagRequest) => {
      const newTag = await window.api.tag.create(tag)
      return newTag
    },
    onSuccess: (newTag) => {
      queryClient.setQueryData<Tag[]>(queryKeys.tags.all, (old) => {
        if (!old) return [newTag]

        const exists = old.find((t) => t.id === newTag.id)
        if (exists) {
          return old.map((t) => (t.id === newTag.id ? newTag : t))
        }

        return [...old, newTag]
      })

      queryClient.setQueryData(queryKeys.tags.detail(newTag.id), newTag)
    },
    onError: (error) => {
      console.error('Tag creation failed:', error)
    }
  })
}

export const useUpdateTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTagRequest }) => {
      const updatedTag = await window.api.tag.update(id, data)
      return updatedTag
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tags.all })

      const previousTags = queryClient.getQueryData<Tag[]>(queryKeys.tags.all)

      queryClient.setQueryData<Tag[]>(queryKeys.tags.all, (old) =>
        old?.map((tag) => (tag.id === id ? { ...tag, ...data } : tag))
      )

      return { previousTags }
    },
    onSuccess: (updatedTag) => {
      queryClient.setQueryData<Tag[]>(queryKeys.tags.all, (old) =>
        old?.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag))
      )
      queryClient.setQueryData(queryKeys.tags.detail(updatedTag.id), updatedTag)
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.today() })
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(queryKeys.tags.all, context.previousTags)
      }
      console.error('Tag update failed:', _err)
    }
  })
}

export const useDeleteTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => window.api.tag.softDelete(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tags.all })

      const previousTags = queryClient.getQueryData<Tag[]>(queryKeys.tags.all)

      queryClient.setQueryData<Tag[]>(queryKeys.tags.all, (old) =>
        old?.filter((tag) => tag.id !== id)
      )

      return { previousTags }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousTags) {
        queryClient.setQueryData(queryKeys.tags.all, context.previousTags)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.today() })
    }
  })
}
