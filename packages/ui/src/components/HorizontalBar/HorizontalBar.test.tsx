import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { HorizontalBar } from './HorizontalBar'

describe('HorizontalBar', () => {
  it('renders with progressbar role', () => {
    const { getByRole } = render(<HorizontalBar value={40} />)

    expect(getByRole('progressbar')).toBeInTheDocument()
  })

  it('clamps fill width at 100% when value exceeds max', () => {
    const { container } = render(<HorizontalBar value={150} max={100} />)

    const fill = container.querySelector('[data-slot="fill"]') as HTMLElement
    expect(fill).toHaveStyle({ width: '100%' })
  })

  it('clamps fill width at 0% when value is lower than min', () => {
    const { container } = render(<HorizontalBar value={-10} min={0} max={100} />)

    const fill = container.querySelector('[data-slot="fill"]') as HTMLElement
    expect(fill).toHaveStyle({ width: '0%' })
  })
})
