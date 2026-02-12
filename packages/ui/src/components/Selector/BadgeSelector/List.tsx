import { useBadgeSelectorContext } from './context'
import { BadgeList } from './BadgeList'

export const List = () => {
  const {
    filteredItems,
    searchTerm,
    canCreateNew,
    previewColor,
    selectItem,
    createItem,
    deleteItem,
    updateItem,
    contentRef
  } = useBadgeSelectorContext()

  return (
    <BadgeList
      items={filteredItems}
      searchTerm={searchTerm}
      canCreateNew={canCreateNew}
      previewColor={previewColor}
      onSelect={selectItem}
      onCreate={createItem}
      onDeleteItem={deleteItem}
      onUpdateItem={updateItem}
      portalContainerRef={contentRef}
    />
  )
}
