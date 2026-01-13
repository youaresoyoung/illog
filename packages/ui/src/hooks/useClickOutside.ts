import { RefObject, useEffect } from 'react'

export type UseClickOutsideOptions = {
  refs: RefObject<HTMLElement | null>[]
  excludeSelectors?: string[]
  onClickOutside: () => void
  enabled?: boolean
}

/**
 * @param refs List of refs to exclude from click detection
 * @param refs Additional CSS selectors to exclude
 * @param refs Callback invoked when clicking outside
 * @param refs Whether the hook is enabled (default: true)
 */
export function useClickOutside({
  refs,
  excludeSelectors = [],
  onClickOutside,
  enabled = true
}: UseClickOutsideOptions): void {
  useEffect(() => {
    if (!enabled) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      if (!target) return

      for (const ref of refs) {
        if (ref.current?.contains(target)) {
          return
        }
      }

      for (const selector of excludeSelectors) {
        if (target.closest(selector)) {
          return
        }
      }

      onClickOutside()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [refs, excludeSelectors, onClickOutside, enabled])
}
