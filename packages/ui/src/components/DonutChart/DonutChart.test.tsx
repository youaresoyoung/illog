import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/react'
import { DonutChart } from './DonutChart'

describe('DonutChart', () => {
  it('renders an empty ring when no segments exist', () => {
    const { container } = render(<DonutChart segments={[]} />)

    expect(container.querySelectorAll('path')).toHaveLength(1)
  })

  it('renders only positive-value segments', () => {
    const { container } = render(
      <DonutChart
        segments={[
          { id: 'a', value: 10, fill: '#111111' },
          { id: 'b', value: 0, fill: '#222222' },
          { id: 'c', value: 30, fill: '#333333' }
        ]}
      />
    )

    expect(container.querySelectorAll('path')).toHaveLength(2)
  })

  it('calls onSegmentClick when a segment is clicked', () => {
    const handleSegmentClick = vi.fn()

    const { container } = render(
      <DonutChart
        segments={[
          { id: 'a', value: 10, fill: '#111111' },
          { id: 'b', value: 20, fill: '#222222' }
        ]}
        onSegmentClick={handleSegmentClick}
      />
    )

    const firstPath = container.querySelector('path')
    expect(firstPath).toBeInTheDocument()

    fireEvent.click(firstPath as SVGPathElement)

    expect(handleSegmentClick).toHaveBeenCalledTimes(1)
    expect(handleSegmentClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'a' }), 0)
  })
})
