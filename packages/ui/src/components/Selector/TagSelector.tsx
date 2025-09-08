import { useTagSelector } from '../../hooks/useTagSelector'
import { OmittedTag, TagType } from '../Tag/types'
import { TagList } from './TagList'
import { SelectedTags } from './SelectedTags'
import * as style from './tagSelector.css'
import { Divider } from '../Divider/Divider'

type Props = {
  tags: TagType[]
  defaultSelectedTags: TagType[]
  placeholder: string
  position: { top: number; left: number }
  maxTagLength?: number
  className?: string
  addTagToTask: (tagId: string) => Promise<void>
  removeTagFromTask: (tagId: string) => Promise<void>
  createTag: (tag: Partial<OmittedTag>) => Promise<string>
  deleteTag: (tagId: string) => Promise<void>
  updateTag: (tagId: string, contents: Partial<OmittedTag>) => Promise<void>
  closeTagSelector: () => void
}

export const TagSelector = ({
  tags = [],
  defaultSelectedTags,
  placeholder = 'Search tags...',
  maxTagLength = 100,
  position = { top: 0, left: 0 },
  className,
  addTagToTask,
  removeTagFromTask,
  createTag,
  deleteTag,
  updateTag,
  closeTagSelector
}: Props) => {
  const {
    searchTerm,
    setSearchTerm,
    defaultSelectedTags: selectedTags,
    selectedTags: syncedSelectedTags,
    filteredTags,
    canCreateNew,
    inputRef,
    containerRef,
    handleTagSelect,
    handleRemoveTagFromTask,
    handleCreateTag,
    handleDeleteTag,
    handleKeyDown
  } = useTagSelector({
    tags,
    defaultSelectedTags,
    maxTagLength,
    addTagToTask,
    removeTagFromTask,
    createTag,
    deleteTag,
    closeTagSelector
  })

  return (
    <div
      className={`${style.container} ${className}`}
      ref={containerRef}
      style={{ top: position.top, left: position.left }}
    >
      <div className={style.inputWrapper}>
        <SelectedTags tags={syncedSelectedTags} removeFromTask={handleRemoveTagFromTask} />
        <input
          className={style.input}
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? placeholder : ''}
          maxLength={maxTagLength}
          autoComplete="off"
          autoFocus={true}
        />
      </div>
      <Divider />
      <TagList
        tags={filteredTags}
        searchTerm={searchTerm}
        canCreateNew={canCreateNew}
        onSelect={handleTagSelect}
        onCreate={handleCreateTag}
        onDeleteTag={handleDeleteTag}
        onUpdateTag={updateTag}
        portalContainerRef={containerRef}
      />
    </div>
  )
}
