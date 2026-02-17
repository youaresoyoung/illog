import { useMemo, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Box } from '../Box'
import { Stack } from '../Stack'
import { Text } from '../Typography'
import type { SortDirection, SortState, SortableTableColumn, SortableTableProps } from './types'

const DEFAULT_EMPTY_MESSAGE = 'No data found'

type PrimitiveSortValue = number | string | null

function normalizeSortValue(value: string | number | Date | null | undefined): PrimitiveSortValue {
  if (value === null || value === undefined) {
    return null
  }

  if (value instanceof Date) {
    return Number.isFinite(value.getTime()) ? value.getTime() : null
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string') {
    return value.toLocaleLowerCase()
  }

  return String(value).toLocaleLowerCase()
}

function compareSortValues(a: PrimitiveSortValue, b: PrimitiveSortValue): number {
  if (a === null && b === null) {
    return 0
  }

  if (a === null) {
    return 1
  }

  if (b === null) {
    return -1
  }

  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b)
  }

  return Number(a) - Number(b)
}

function isSortableColumn<T, F extends string>(column: SortableTableColumn<T, F>): boolean {
  return column.sortable !== false
}

function resolveInitialSortState<T, F extends string>(
  columns: SortableTableColumn<T, F>[],
  defaultSort?: SortState<F>
): SortState<F> | null {
  if (defaultSort) {
    return defaultSort
  }

  const firstSortableColumn = columns.find((column) => isSortableColumn(column))
  if (!firstSortableColumn) {
    return null
  }

  return {
    field: firstSortableColumn.field,
    direction: 'desc'
  }
}

function resolveNextDirection(currentSort: SortDirection, isSameField: boolean): SortDirection {
  if (!isSameField) {
    return 'desc'
  }
  return currentSort === 'desc' ? 'asc' : 'desc'
}

function resolveRowId<T>(item: T, index: number): string {
  if (typeof item === 'object' && item !== null && 'id' in item) {
    const possibleId = (item as { id?: unknown }).id
    if (possibleId !== undefined && possibleId !== null) {
      return String(possibleId)
    }
  }

  return String(index)
}

export const SortableTable = <T, F extends string>({
  data,
  columns,
  getRowId,
  defaultSort,
  sortState,
  onSortChange,
  emptyState,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  className
}: SortableTableProps<T, F>) => {
  const [internalSortState, setInternalSortState] = useState<SortState<F> | null>(() =>
    resolveInitialSortState(columns, defaultSort)
  )

  const activeSortState = sortState ?? internalSortState

  const sortedData = useMemo(() => {
    if (!activeSortState) {
      return data
    }

    const activeColumn = columns.find((column) => column.field === activeSortState.field)
    if (!activeColumn || !isSortableColumn(activeColumn)) {
      return data
    }

    const sorted = [...data]

    sorted.sort((a, b) => {
      const rawA = activeColumn.getSortValue
        ? activeColumn.getSortValue(a)
        : (a as Record<string, unknown>)[activeColumn.field]
      const rawB = activeColumn.getSortValue
        ? activeColumn.getSortValue(b)
        : (b as Record<string, unknown>)[activeColumn.field]

      const compared = compareSortValues(
        normalizeSortValue(rawA as string | number | Date | null | undefined),
        normalizeSortValue(rawB as string | number | Date | null | undefined)
      )
      return activeSortState.direction === 'asc' ? compared : compared * -1
    })

    return sorted
  }, [activeSortState, columns, data])

  const handleToggleSort = (field: F) => {
    const column = columns.find((col) => col.field === field)
    if (!column || !isSortableColumn(column)) {
      return
    }

    const nextSortState: SortState<F> = {
      field,
      direction: resolveNextDirection(
        activeSortState?.direction ?? 'desc',
        activeSortState?.field === field
      )
    }

    if (sortState === undefined) {
      setInternalSortState(nextSortState)
    }

    onSortChange?.(nextSortState)
  }

  const handleHeaderKeyDown = (
    event: KeyboardEvent<HTMLTableCellElement>,
    field: F,
    sortable: boolean
  ) => {
    if (!sortable) {
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleToggleSort(field)
    }
  }

  if (data.length === 0) {
    return (
      <Stack className={className}>
        {emptyState ?? (
          <Box px="600" py="400">
            <Text textStyle="bodyBase" color="textDefaultTertiary">
              {emptyMessage}
            </Text>
          </Box>
        )}
      </Stack>
    )
  }

  return (
    <Stack gap="400" className={className}>
      <Box
        as="table"
        bg="backgroundDefaultDefault"
        rounded="200"
        overflow="hidden"
        border="border"
        borderStyle="solid"
        borderColor="borderDefaultDefault"
        style={{ borderCollapse: 'separate', borderSpacing: '0' }}
      >
        <Box as="thead" bg="backgroundDefaultSecondary">
          <Box as="tr">
            {columns.map((column) => {
              const sortable = isSortableColumn(column)
              const isActiveColumn = activeSortState?.field === column.field
              const sortIndicator =
                activeSortState && isActiveColumn && sortable
                  ? activeSortState.direction === 'asc'
                    ? '↑'
                    : '↓'
                  : ' '

              return (
                <Box
                  as="th"
                  key={column.field}
                  textAlign={column.headerAlign ?? 'left'}
                  p="300"
                  borderBottom="border"
                  borderBottomStyle="solid"
                  borderBottomColor="borderDefaultDefault"
                  cursor={sortable ? 'pointer' : 'default'}
                  userSelect="none"
                  onClick={sortable ? () => handleToggleSort(column.field) : undefined}
                  onKeyDown={(event) => handleHeaderKeyDown(event, column.field, sortable)}
                  tabIndex={sortable ? 0 : undefined}
                  aria-sort={
                    sortable
                      ? isActiveColumn
                        ? activeSortState && activeSortState.direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                      : undefined
                  }
                  style={column.width !== undefined ? { width: column.width } : undefined}
                >
                  <Text
                    textStyle="bodySmallStrong"
                    color="textDefaultDefault"
                    display="inline-flex"
                    alignItems="center"
                    gap="100"
                  >
                    {column.header}
                    {sortable ? sortIndicator : null}
                  </Text>
                </Box>
              )
            })}
          </Box>
        </Box>

        <Box as="tbody">
          {sortedData.map((item, rowIndex) => {
            const rowId = getRowId ? getRowId(item, rowIndex) : resolveRowId(item, rowIndex)

            return (
              <Box as="tr" key={rowId}>
                {columns.map((column) => (
                  <Box
                    as="td"
                    key={column.field}
                    p="300"
                    textAlign={column.cellAlign ?? 'left'}
                    borderBottom="border"
                    borderBottomStyle="solid"
                    borderBottomColor="borderDefaultDefault"
                  >
                    {column.render(item, rowIndex)}
                  </Box>
                ))}
              </Box>
            )
          })}
        </Box>
      </Box>
    </Stack>
  )
}
