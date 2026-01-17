import { $getSelection, $isRangeSelection, $isTextNode, LexicalNode } from 'lexical'

export const FLOATING_TOOLBAR_CONFIG = {
  verticalGap: 10,
  horizontalPadding: 5
} as const

export interface FloatingPosition {
  top: number
  left: number
  opacity: '0' | '1'
}

export function getDOMRangeRect(
  nativeSelection: Selection,
  rootElement: HTMLElement
): DOMRect | null {
  // 1. If there is no selection range, return null
  if (nativeSelection.rangeCount === 0) {
    return null
  }

  const domRange = nativeSelection.getRangeAt(0)

  // 2. If empty Editor: Selection points directly to root
  if (nativeSelection.anchorNode === rootElement) {
    let inner = rootElement
    while (inner.firstElementChild != null) {
      inner = inner.firstElementChild as HTMLElement
    }
    return inner.getBoundingClientRect()
  }

  // 3. Return selected text range
  return domRange.getBoundingClientRect()
}

/**
 *
 * Depends on selection direction
 * - Forward selection: prioritize anchor node
 * - Backward selection: prioritize focus node
 *
 * "Hello" → "World"    "Hello" ← "World"
 *    ↑        ↑           ↑        ↑
 *  anchor   focus       focus    anchor
 */
export function getSelectedNode(selection: ReturnType<typeof $getSelection>): LexicalNode | null {
  if (!$isRangeSelection(selection)) return null

  const anchorNode = selection.anchor.getNode()
  const focusNode = selection.focus.getNode()

  if (anchorNode === focusNode) {
    return anchorNode
  }

  const isBackward = selection.isBackward()
  if (isBackward) {
    return $isTextNode(focusNode) ? focusNode : anchorNode
  } else {
    return $isTextNode(anchorNode) ? anchorNode : focusNode
  }
}

export function setFloatingElemPosition(
  targetRect: DOMRect | null,
  floatingElem: HTMLElement,
  anchorElem: HTMLElement
): void {
  const scrollerElem = anchorElem.parentElement
  const { verticalGap, horizontalPadding } = FLOATING_TOOLBAR_CONFIG

  if (targetRect === null || !scrollerElem) {
    floatingElem.style.opacity = '0'
    floatingElem.style.transform = 'translate(-10000px, -10000px)'
    return
  }

  const floatingElemRect = floatingElem.getBoundingClientRect()
  const anchorElementRect = anchorElem.getBoundingClientRect()
  const editorScrollerRect = scrollerElem.getBoundingClientRect()

  // 1. Basic position: above the selection, centered
  let top = targetRect.top - floatingElemRect.height - verticalGap
  let left = targetRect.left + targetRect.width / 2 - floatingElemRect.width / 2

  // 2. Flip below if top boundary collision
  if (top < editorScrollerRect.top) {
    top = targetRect.bottom + verticalGap
  }

  // 3. Handle left boundary
  if (left < editorScrollerRect.left) {
    left = editorScrollerRect.left + horizontalPadding
  }

  // 4. Handle right boundary
  if (left + floatingElemRect.width > editorScrollerRect.right) {
    left = editorScrollerRect.right - floatingElemRect.width - horizontalPadding
  }

  // 5. Calculate relative position based on anchorElement (Editor wrapper)
  top -= anchorElementRect.top
  left -= anchorElementRect.left

  floatingElem.style.opacity = '1'
  floatingElem.style.transform = `translate(${left}px, ${top}px)`
}
