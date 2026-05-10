import { memo, type ReactNode, useMemo } from 'react'
import { SortableTable } from '@illog/ui'
import type { SortableTableColumn } from '@illog/ui'

export type ColumnDef<T, F extends string> = {
  field: F
  header: string
  render: (item: T) => ReactNode
}

type Props<T extends { id: string }, F extends string> = {
  data: T[]
  columns: ColumnDef<T, F>[]
  defaultSortField: F
  getFieldValue: (item: T, field: F) => string | number
  emptyMessage?: string
}

function SortableMetricsTableInner<T extends { id: string }, F extends string>({
  data,
  columns,
  defaultSortField,
  getFieldValue,
  emptyMessage = 'No data found'
}: Props<T, F>) {
  const sortableColumns = useMemo<SortableTableColumn<T, F>[]>(
    () =>
      columns.map((column) => ({
        field: column.field,
        header: column.header,
        render: (item) => column.render(item),
        getSortValue: (item) => getFieldValue(item, column.field)
      })),
    [columns, getFieldValue]
  )

  return (
    <SortableTable
      data={data}
      columns={sortableColumns}
      getRowId={(item) => item.id}
      defaultSort={{ field: defaultSortField, direction: 'desc' }}
      emptyMessage={emptyMessage}
    />
  )
}

export const SortableMetricsTable = memo(
  SortableMetricsTableInner
) as typeof SortableMetricsTableInner
