import { Tag } from '../Tag'
import { TagType } from '../Tag/types'
import * as style from './tagSelector.css'

type Props = {
  tags: TagType[]
  searchTerm: string
  canCreateNew: boolean
  onSelect: (tag: TagType) => void
  onCreate: () => void
}

export const TagList = ({ tags, searchTerm, canCreateNew, onSelect, onCreate }: Props) => {
  return (
    <div className={style.tagListContainer}>
      <p className={style.tagListDescription}>Select tag or create one</p>
      {canCreateNew ? (
        <button type="button" onClick={onCreate} className={style.createNewTagButton}>
          Create <Tag tag={{ id: 'preview', name: searchTerm, color: 'blue' }} />
        </button>
      ) : (
        <ul className={style.tagList}>
          {tags.length > 0 &&
            tags.map((tag) => (
              <li className={style.tagItem} key={tag.id} onClick={() => onSelect(tag)}>
                <Tag tag={tag} />
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
