import { RefObject, useCallback, useRef } from 'react'

const ITEM_SELECTOR =
  '[role="menuitem"]:not([data-disabled]), [role="menuitemcheckbox"]:not([data-disabled]), [role="menuitemradio"]:not([data-disabled])'

type Props = {
  containerRef: RefObject<HTMLElement | null>
  isLoop: boolean
}

export function useRovingFocus({ containerRef, isLoop }: Props) {
  const highlightedRef = useRef<HTMLElement | null>(null)

  const getItems = useCallback(() => {
    if (!containerRef.current) return []
    return Array.from(containerRef.current.querySelectorAll(ITEM_SELECTOR)) as HTMLElement[]
  }, [containerRef])

  const clearHighlight = useCallback(() => {
    if (highlightedRef.current) {
      highlightedRef.current.removeAttribute('data-highlighted')
      highlightedRef.current = null
    }
  }, [])

  const highlight = useCallback(
    (index: number) => {
      const items = getItems()
      clearHighlight()

      if (index >= 0 && index < items.length) {
        const item = items[index]
        item.setAttribute('data-highlighted', '')
        item.focus()
        highlightedRef.current = item
      }
    },
    [getItems, clearHighlight]
  )

  const getHighlightedIndex = useCallback(() => {
    if (!highlightedRef.current) return -1
    const items = getItems()
    return items.indexOf(highlightedRef.current)
  }, [getItems])

  const highlightNext = useCallback(() => {
    const items = getItems()
    if (items.length === 0) return
    const current = getHighlightedIndex()
    let next = current + 1
    if (next >= items.length) {
      next = isLoop ? 0 : items.length - 1
    }
    highlight(next)
  }, [getItems, getHighlightedIndex, highlight, isLoop])

  const highlightPrev = useCallback(() => {
    const items = getItems()
    if (items.length === 0) return
    const current = getHighlightedIndex()
    let prev = current - 1
    if (prev < 0) {
      prev = isLoop ? items.length - 1 : 0
    }
    highlight(prev)
  }, [getItems, getHighlightedIndex, highlight, isLoop])

  const highlightFirst = useCallback(() => highlight(0), [highlight])

  const highlightLast = useCallback(() => {
    const items = getItems()
    highlight(items.length - 1)
  }, [getItems, highlight])

  const highlightByElement = useCallback(
    (element: HTMLElement) => {
      clearHighlight()
      element.setAttribute('data-highlighted', '')
      highlightedRef.current = element
      element.focus()
    },
    [clearHighlight]
  )

  return {
    getItems,
    getHighlightedIndex,
    highlightedRef,
    highlight,
    highlightNext,
    highlightPrev,
    highlightFirst,
    highlightLast,
    highlightByElement,
    clearHighlight
  }
}
