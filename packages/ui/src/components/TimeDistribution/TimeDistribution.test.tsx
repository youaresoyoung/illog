import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimeDistribution } from './TimeDistribution'

type Metric = {
  id: string
  name: string
  value: number
  fill: string
  stroke: string
}

const METRICS: Metric[] = [
  { id: '1', name: 'A', value: 20, fill: '#111111', stroke: '#000000' },
  { id: '2', name: 'B', value: 10, fill: '#222222', stroke: '#111111' }
]

describe('TimeDistribution', () => {
  it('renders empty message when no items exist', () => {
    const { getByText } = render(
      <TimeDistribution
        title="Distribution"
        items={[] as Metric[]}
        getValue={(item) => item.value}
        getFillColor={(item) => item.fill}
        getLabel={(item) => item.name}
      />
    )

    expect(getByText('No data available')).toBeInTheDocument()
  })

  it('renders labels with calculated percentages', () => {
    const { getByText } = render(
      <TimeDistribution
        title="Distribution"
        items={METRICS}
        getValue={(item) => item.value}
        getFillColor={(item) => item.fill}
        getStrokeColor={(item) => item.stroke}
        getKey={(item) => item.id}
        getLabel={(item, context) => `${item.name} (${context.percentage.toFixed(0)}%)`}
      />
    )

    expect(getByText('A (67%)')).toBeInTheDocument()
    expect(getByText('B (33%)')).toBeInTheDocument()
  })

  it('calls onItemClick when legend item is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    const { getByRole } = render(
      <TimeDistribution
        title="Distribution"
        items={METRICS}
        getValue={(item) => item.value}
        getFillColor={(item) => item.fill}
        getKey={(item) => item.id}
        getLabel={(item) => item.name}
        onItemClick={handleClick}
      />
    )

    await user.click(getByRole('button', { name: 'A' }))

    expect(handleClick).toHaveBeenCalledTimes(1)
    expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }), 0)
  })
})
