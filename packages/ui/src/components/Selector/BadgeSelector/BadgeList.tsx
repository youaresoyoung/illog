import * as style from '../selector.css'
import { RefObject, useState, useRef, useCallback, useEffect, memo } from 'react'
import { Icon } from '../../Icon'
import { Portal } from '../../Portal'
import { BadgeItem, BadgeColor, OmittedBadgeItem, Badge } from '../../Badge'
import { BadgeEditor } from './BadgeEditor'

type Props = {
  items: BadgeItem[]
  searchTerm: string
  canCreateNew: boolean
  previewColor: BadgeColor
  onSelect: (item: BadgeItem) => Promise<void>
  onCreate: () => Promise<void>
  onDeleteItem: (itemId: string) => Promise<void>
  onUpdateItem: (itemId: string, contents: Partial<OmittedBadgeItem>) => Promise<void>
  portalContainerRef?: RefObject<Element | DocumentFragment | null>
}

const BadgeListBase = ({
  items,
  searchTerm,
  canCreateNew,
  previewColor,
  onSelect,
  onCreate,
  onDeleteItem,
  onUpdateItem,
  portalContainerRef
}: Props) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editorPosition, setEditorPosition] = useState<{ left: number; top: number } | null>(null)
  const moreBtnRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const editorRef = useRef<HTMLDivElement | null>(null)

  const updateSelectorPosition = useCallback((itemId: string | null) => {
    if (!itemId) return
    const btn = moreBtnRefs.current[itemId]
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    setEditorPosition({
      top: rect.bottom + 8,
      left: rect.left
    })
  }, [])

  const handleMoreClick = (itemId: string) => {
    setEditingItemId(itemId)
  }

  const handleCloseEditor = () => {
    setEditingItemId(null)
    setEditorPosition(null)
  }

  useEffect(() => {
    if (!editingItemId) return
    updateSelectorPosition(editingItemId)

    const handleScroll = () => updateSelectorPosition(editingItemId)
    const handleResize = () => updateSelectorPosition(editingItemId)

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [editingItemId, updateSelectorPosition])

  useEffect(() => {
    if (!editingItemId) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        editorRef.current &&
        !editorRef.current.contains(target) &&
        !moreBtnRefs.current[editingItemId]?.contains(target)
      ) {
        handleCloseEditor()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editingItemId])

  return (
    <div className={style.tagListContainer}>
      <p className={style.tagListDescription}>Select an option or create one</p>
      {canCreateNew ? (
        <button type="button" onClick={onCreate} className={style.createNewTagButton}>
          Create{' '}
          <Badge item={{ id: 'preview', name: searchTerm || 'new item', color: previewColor }} />
        </button>
      ) : (
        <ul className={style.tagList}>
          {/* eslint-disable-next-line react-hooks/refs */}
          {items.map((item) => (
            <li className={style.tagItem} key={item.id} onClick={() => onSelect(item)}>
              <Badge item={item} />
              <button
                className={style.moreButton}
                type="button"
                tabIndex={-1}
                aria-label="edit item"
                ref={(el) => {
                  moreBtnRefs.current[item.id] = el
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleMoreClick(item.id)
                }}
              >
                <Icon name="more" size="large" />
              </button>
              {editingItemId === item.id && editorPosition && (
                <Portal container={portalContainerRef?.current ?? undefined}>
                  <div
                    ref={editorRef}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    style={{
                      position: 'fixed',
                      left: editorPosition.left,
                      top: editorPosition.top,
                      zIndex: 9999
                    }}
                  >
                    <BadgeEditor
                      item={item}
                      onDelete={onDeleteItem}
                      onChange={onUpdateItem}
                      onCloseEditor={handleCloseEditor}
                    />
                  </div>
                </Portal>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export const BadgeList = memo(BadgeListBase)
BadgeList.displayName = 'BadgeList'
