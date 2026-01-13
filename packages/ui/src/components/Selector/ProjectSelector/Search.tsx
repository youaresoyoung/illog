import { useProjectSelectorContext } from './context'
import { ProjectBadge } from '../../ProjectBadge'
import * as style from '../selector.css'

type SearchProps = {
  placeholder?: string
  maxLength?: number
}

export const Search = ({ placeholder = 'Search projects...', maxLength = 100 }: SearchProps) => {
  const { searchTerm, setSearchTerm, selectedProject, clearProject, inputRef, handleKeyDown } =
    useProjectSelectorContext()

  return (
    <div className={style.inputWrapper}>
      {selectedProject && <ProjectBadge project={selectedProject} onRemove={clearProject} />}
      <input
        ref={inputRef}
        className={style.input}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={!selectedProject ? placeholder : ''}
        maxLength={maxLength}
        autoComplete="off"
        autoFocus
      />
    </div>
  )
}
