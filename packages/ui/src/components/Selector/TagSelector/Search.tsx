import { useTagSelectorContext } from './context'
import { Tag } from '../../Tag'
import * as style from '../selector.css'

type SearchProps = {
  placeholder?: string
  maxLength?: number
}

export const Search = ({ placeholder = 'Search tags...', maxLength = 100 }: SearchProps) => {
  const { searchTerm, setSearchTerm, selectedTags, removeTag, inputRef, handleKeyDown } =
    useTagSelectorContext()

  return (
    <div className={style.inputWrapper}>
      {selectedTags.map((tag) => (
        <Tag key={tag.id} tag={tag} removeFromTask={() => void removeTag(tag.id)} />
      ))}
      <input
        ref={inputRef}
        className={style.input}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={selectedTags.length === 0 ? placeholder : ''}
        maxLength={maxLength}
        autoComplete="off"
        autoFocus
      />
    </div>
  )
}
