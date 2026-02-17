import type { ReactNode } from 'react'

export type SortDirection = 'asc' | 'desc'

export type SortState<F extends string> = {
  field: F
  direction: SortDirection
}

export type SortableTableColumn<T, F extends string> = {
  field: F
  header: ReactNode
  render: (item: T, rowIndex: number) => ReactNode
  sortable?: boolean
  getSortValue?: (item: T) => string | number | Date | null | undefined
  headerAlign?: 'left' | 'center' | 'right'
  cellAlign?: 'left' | 'center' | 'right'
  width?: string | number
}

export type SortableTableProps<T, F extends string> = {
  data: T[]
  columns: SortableTableColumn<T, F>[]
  getRowId?: (item: T, index: number) => string
  defaultSort?: SortState<F>
  sortState?: SortState<F>
  onSortChange?: (nextSort: SortState<F>) => void
  emptyState?: ReactNode
  emptyMessage?: ReactNode
  className?: string
}
