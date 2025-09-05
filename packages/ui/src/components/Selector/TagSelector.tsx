import { useTagSelector } from '../../hooks/useTagSelector'
import { OmittedTag, TagType } from '../Tag/types'
import { TagList } from './TagList'
import { SelectedTags } from './SelectedTags'
import * as style from './tagSelector.css'
import { Divider } from '../Divider/Divider'

type Props = {
  tags: TagType[]
  defaultSelectedTags: TagType[]
  addTagToTask: (tagId: string) => Promise<void>
  createTag: (tag: Partial<OmittedTag>) => Promise<string>
  removeTagFromTask: (tagId: string) => Promise<void>
  placeholder: string
  maxTagLength?: number
  position: { top: number; left: number }
  className?: string
}

export const TagSelector = ({
  tags = [],
  defaultSelectedTags,
  addTagToTask,
  createTag,
  removeTagFromTask,
  placeholder = 'Search tags...',
  maxTagLength = 100,
  position = { top: 0, left: 0 },
  className
}: Props) => {
  const {
    searchTerm,
    setSearchTerm,
    defaultSelectedTags: selectedTags,
    filteredTags,
    canCreateNew,
    inputRef,
    containerRef,
    handleTagSelect,
    handleRemoveTagFromTask,
    handleCreateTag,
    handleKeyDown
  } = useTagSelector({
    tags,
    defaultSelectedTags,
    addTagToTask,
    createTag,
    removeTagFromTask,
    maxTagLength
  })

  return (
    <div
      className={`${style.container} ${className}`}
      ref={containerRef}
      style={{ top: position.top, left: position.left }}
    >
      <div className={style.inputWrapper}>
        <SelectedTags tags={defaultSelectedTags} removeFromTask={handleRemoveTagFromTask} />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? placeholder : ''}
          maxLength={maxTagLength}
          autoComplete="off"
        />
      </div>
      <Divider />
      <TagList
        tags={filteredTags}
        searchTerm={searchTerm}
        canCreateNew={canCreateNew}
        onSelect={handleTagSelect}
        onCreate={handleCreateTag}
      />
    </div>
  )
}
