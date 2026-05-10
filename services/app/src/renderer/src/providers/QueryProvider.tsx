import { QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { getUserMessage } from '../../../shared/errors'
import { useToastStore } from '../stores/useToastStore'
import { useState } from 'react'

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      errorMessage?: string
      successMessage?: string
      silent?: boolean
    }
  }
}

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
            refetchOnWindowFocus: false,
            retry: (failureCount, error) => {
              const code = (error as unknown as { code?: string })?.code
              if (
                code === 'NOT_FOUND' ||
                code === 'VALIDATION_ERROR' ||
                code === 'FEATURE_DISABLED'
              ) {
                return false
              }
              return failureCount < 1
            }
          },
          mutations: {
            retry: 0
          }
        },
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.silent) return
            const context = mutation.meta?.errorMessage
            const detail = getUserMessage(error)
            const message = context ? `${context}: ${detail}` : detail
            useToastStore.getState().addToast({ type: 'error', message })
          },
          onSuccess: (_data, _variables, _context, mutation) => {
            if (mutation.meta?.successMessage) {
              useToastStore.getState().addToast({
                type: 'success',
                message: mutation.meta.successMessage
              })
            }
          }
        })
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
