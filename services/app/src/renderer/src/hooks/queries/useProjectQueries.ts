import type { CreateProjectRequest, Project, UpdateProjectRequest } from '../../../../shared/types'
import { queryKeys } from './queryKeys'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { PROJECT_CREATED, PROJECT_DELETED } from '@illog/analytics'

export const useAllProjects = () => {
  return useQuery({
    queryKey: queryKeys.projects.all,
    queryFn: () => window.api.project.getAll()
  })
}

export const useProject = (id: string) => {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => window.api.project.get(id),
    enabled: !!id
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (project: CreateProjectRequest) => {
      const newProject = await window.api.project.create(project)
      return newProject
    },
    meta: { errorMessage: 'Failed to create project', successMessage: 'Project created' },
    onSuccess: (newProject) => {
      queryClient.setQueryData<Project[]>(queryKeys.projects.all, (old) => {
        if (!old) return [newProject]

        const exists = old.find((p) => p.id === newProject.id)
        if (exists) {
          return old.map((p) => (p.id === newProject.id ? newProject : p))
        }

        return [...old, newProject]
      })

      queryClient.setQueryData(queryKeys.projects.detail(newProject.id), newProject)
      window.api?.analytics?.track(PROJECT_CREATED)
    },
    onError: () => {
      // Global MutationCache onError handles toast display
    }
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateProjectRequest }) => {
      const updatedProject = await window.api.project.update(id, data)
      return updatedProject
    },
    meta: { errorMessage: 'Failed to update project' },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.projects.all })

      const previousProjects = queryClient.getQueryData<Project[]>(queryKeys.projects.all)

      queryClient.setQueryData<Project[]>(queryKeys.projects.all, (old) =>
        old?.map((project) => (project.id === id ? { ...project, ...data } : project))
      )

      return { previousProjects }
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData<Project[]>(queryKeys.projects.all, (old) =>
        old?.map((project) => (project.id === updatedProject.id ? updatedProject : project))
      )
      queryClient.setQueryData(queryKeys.projects.detail(updatedProject.id), updatedProject)
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.today() })
    },
    onError: (_err, _variables, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(queryKeys.projects.all, context.previousProjects)
      }
    }
  })
}

export const useDeleteProject = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => window.api.project.softDelete(id),
    meta: { errorMessage: 'Failed to delete project', successMessage: 'Project deleted' },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.projects.all })

      const previousProjects = queryClient.getQueryData<Project[]>(queryKeys.projects.all)

      queryClient.setQueryData<Project[]>(queryKeys.projects.all, (old) =>
        old?.filter((project) => project.id !== id)
      )

      return { previousProjects }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(queryKeys.projects.all, context.previousProjects)
      }
    },
    onSuccess: () => {
      window.api?.analytics?.track(PROJECT_DELETED)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.today() })
    }
  })
}
