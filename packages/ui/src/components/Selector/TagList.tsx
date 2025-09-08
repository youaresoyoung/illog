import { Tag } from '../Tag'
import { OmittedTag, TagType } from '../Tag/types'
import { Icon } from '../Icon'
import { TagEditor } from './TagEditor'
import * as style from './tagSelector.css'
import { useEffect, useRef, useState, useCallback, memo, RefObject } from 'react'
import { Portal } from '../Portal'

type Props = {
  tags: TagType[]
  searchTerm: string
  canCreateNew: boolean
  onSelect: (tag: TagType) => Promise<void>
  onCreate: () => Promise<void>
  onDeleteTag: (tagId: string) => Promise<void>
  onUpdateTag: (tagId: string, contents: Partial<OmittedTag>) => Promise<void>
  portalContainerRef?: RefObject<Element | DocumentFragment | null>
}

const TagListBase = ({
  tags,
  searchTerm,
  canCreateNew,
  onSelect,
  onCreate,
  onDeleteTag,
  onUpdateTag,
  portalContainerRef
}: Props) => {
  const [editingTagId, setEditingTagId] = useState<string | null>(null)
  const [editorPosition, setEditorPosition] = useState<{ left: number; top: number } | null>(null)
  const moreBtnRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})
  const editorRef = useRef<HTMLDivElement | null>(null)

  const updateSelectorPosition = useCallback((tagId: string | null) => {
    if (!tagId) return
    const btn = moreBtnRefs.current[tagId]
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    setEditorPosition({
      top: rect.bottom + 8,
      left: rect.left
    })
  }, [])

  const handleMoreClick = (tagId: string) => {
    setEditingTagId(tagId)
  }

  const handleCloseEditor = () => {
    setEditingTagId(null)
    setEditorPosition(null)
  }

  useEffect(() => {
    if (!editingTagId) return
    updateSelectorPosition(editingTagId)

    const handleScroll = () => updateSelectorPosition(editingTagId)
    const handleResize = () => updateSelectorPosition(editingTagId)

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [editingTagId, updateSelectorPosition])

  useEffect(() => {
    if (!editingTagId) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        editorRef.current &&
        !editorRef.current.contains(target) &&
        !moreBtnRefs.current[editingTagId]?.contains(target)
      ) {
        handleCloseEditor()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editingTagId])

  return (
    <div className={style.tagListContainer}>
      <p className={style.tagListDescription}>Select tag or create one</p>
      {canCreateNew ? (
        <button type="button" onClick={onCreate} className={style.createNewTagButton}>
          Create <Tag tag={{ id: 'preview', name: searchTerm || 'new tag', color: 'blue' }} />
        </button>
      ) : (
        <ul className={style.tagList}>
          {tags.map((tag) => (
            <li className={style.tagItem} key={tag.id} onClick={() => onSelect(tag)}>
              <div>
                <Tag tag={tag} />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="edit tag"
                  ref={(el) => {
                    moreBtnRefs.current[tag.id] = el
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMoreClick(tag.id)
                  }}
                >
                  <Icon name="more" />
                </button>
              </div>
              {editingTagId === tag.id && editorPosition && (
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
                    <TagEditor
                      tag={tag}
                      onDelete={onDeleteTag}
                      onChange={onUpdateTag}
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

export const TagList = memo(TagListBase)
TagList.displayName = 'TagList'
