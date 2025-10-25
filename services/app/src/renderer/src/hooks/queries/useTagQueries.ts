import { OmittedTag, Tag } from 'services/app/src/types'
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
    mutationFn: (tag: Partial<OmittedTag>) => window.api.tag.create(tag),
    onSuccess: (newTag) => {
      queryClient.setQueryData<Tag[]>(queryKeys.tags.all, (old) =>
        old ? [...old, newTag] : [newTag]
      )
    }
  })
}

export const useUpdateTag = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, contents }: { id: string; contents: Partial<OmittedTag> }) =>
      window.api.tag.update(id, contents),
    onSuccess: (updatedTag) => {
      queryClient.setQueryData<Tag[]>(queryKeys.tags.all, (old) =>
        old?.map((tag) => (tag.id === updatedTag.id ? updatedTag : tag))
      )
      queryClient.setQueryData(queryKeys.tags.detail(updatedTag.id), updatedTag)
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
