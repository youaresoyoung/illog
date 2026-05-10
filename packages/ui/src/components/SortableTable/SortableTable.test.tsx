import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SortableTable } from './SortableTable'
import type { SortableTableColumn } from './types'

type Row = {
  id: string
  name: string
  count: number
}

const COLUMNS: SortableTableColumn<Row, 'name' | 'count'>[] = [
  {
    field: 'name',
    header: 'Name',
    render: (item: Row) => item.name,
    getSortValue: (item: Row) => item.name
  },
  {
    field: 'count',
    header: 'Count',
    render: (item: Row) => item.count,
    getSortValue: (item: Row) => item.count
  }
]

const DATA: Row[] = [
  { id: '1', name: 'B', count: 1 },
  { id: '2', name: 'A', count: 2 }
]

describe('SortableTable', () => {
  it('renders empty message when data is empty', () => {
    const { getByText } = render(
      <SortableTable<Row, 'name' | 'count'>
        data={[]}
        columns={COLUMNS}
        defaultSort={{ field: 'count', direction: 'desc' }}
      />
    )

    expect(getByText('No data found')).toBeInTheDocument()
  })

  it('sorts by default sort field', () => {
    const { container } = render(
      <SortableTable<Row, 'name' | 'count'>
        data={DATA}
        columns={COLUMNS}
        defaultSort={{ field: 'count', direction: 'desc' }}
      />
    )

    const rows = container.querySelectorAll('tbody tr')
    expect(rows[0]).toHaveTextContent('A')
    expect(rows[1]).toHaveTextContent('B')
  })

  it('toggles sort direction when header is clicked', async () => {
    const user = userEvent.setup()

    const { container, getByText } = render(
      <SortableTable<Row, 'name' | 'count'>
        data={DATA}
        columns={COLUMNS}
        defaultSort={{ field: 'count', direction: 'desc' }}
      />
    )

    const nameHeader = getByText('Name').closest('th')
    expect(nameHeader).toBeInTheDocument()

    await user.click(nameHeader as HTMLTableCellElement)

    let rows = container.querySelectorAll('tbody tr')
    expect(rows[0]).toHaveTextContent('B')
    expect(rows[1]).toHaveTextContent('A')

    await user.click(nameHeader as HTMLTableCellElement)

    rows = container.querySelectorAll('tbody tr')
    expect(rows[0]).toHaveTextContent('A')
    expect(rows[1]).toHaveTextContent('B')
  })
})
