import { useTagSelectorContext } from './context'
import { TagList as TagListBase } from './TagList'

export const List = () => {
  const {
    filteredTags,
    searchTerm,
    canCreateNew,
    previewColor,
    selectTag,
    createTag,
    deleteTag,
    updateTag,
    contentRef
  } = useTagSelectorContext()

  return (
    <TagListBase
      tags={filteredTags}
      searchTerm={searchTerm}
      canCreateNew={canCreateNew}
      previewColor={previewColor}
      onSelect={selectTag}
      onCreate={createTag}
      onDeleteTag={deleteTag}
      onUpdateTag={updateTag}
      portalContainerRef={contentRef}
    />
  )
}
