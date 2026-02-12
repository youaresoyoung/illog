import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import { Icon } from './Icon'

describe('Icon', () => {
  it('returns null and warns for non-existent icon name', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const INVALID_ICON_NAME = 'non_existent_icon'

    // @ts-expect-error - testing invalid icon name
    const { container } = render(<Icon name={INVALID_ICON_NAME} />)

    expect(container.textContent).toBe('')
    expect(consoleSpy).toHaveBeenCalledWith(`Icon with name "${INVALID_ICON_NAME}" does not exist.`)

    consoleSpy.mockRestore()
  })

  it('renders something for valid icon name', () => {
    const { container } = render(<Icon name="check" />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders different icons by name without error', () => {
    const icons = ['plus', 'trash', 'setting', 'menu'] as const

    icons.forEach((name) => {
      const { container } = render(<Icon name={name} />)
      expect(container.firstChild).not.toBeNull()
    })
  })

  it('renders correctly according to attributes', () => {
    const { container } = render(<Icon name="check" size="large" color="iconBrandOnBrand" />)

    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('role', 'img')
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
    expect(svg).toHaveAttribute('aria-label', 'check')
    expect(svg).toHaveStyle({ color: 'var(--icon-brand-on-brand)' })
  })
})
