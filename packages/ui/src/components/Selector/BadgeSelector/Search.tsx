import { useBadgeSelectorContext } from './context'
import { Badge } from '../../Badge'
import * as style from '../selector.css'

type SearchProps = {
  placeholder?: string
  maxLength?: number
}

export const Search = ({ placeholder = 'Search...', maxLength = 100 }: SearchProps) => {
  const { searchTerm, setSearchTerm, selectedItem, clearItem, inputRef, handleKeyDown } =
    useBadgeSelectorContext()

  return (
    <div className={style.inputWrapper}>
      {selectedItem && <Badge item={selectedItem} onRemove={clearItem} />}
      <input
        ref={inputRef}
        className={style.input}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={!selectedItem ? placeholder : ''}
        maxLength={maxLength}
        autoComplete="off"
        autoFocus
      />
    </div>
  )
}
