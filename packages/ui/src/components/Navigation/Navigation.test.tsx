import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigation } from './index'
import { MemoryRouter } from 'react-router'
import { useState } from 'react'

// Navigation 컴포넌트들은 react-router의 Link를 사용하므로 Router로 감싸야 함
const renderWithRouter = (ui: React.ReactElement, initialEntries: string[] = ['/']) => {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>)
}

describe('Navigation - Uncontrolled', () => {
  it('renders with default value', () => {
    renderWithRouter(
      <Navigation.Root defaultValue="home">
        <Navigation.List>
          <Navigation.Item value="home" to="/">
            Home
          </Navigation.Item>
          <Navigation.Item value="about" to="/about">
            About
          </Navigation.Item>
        </Navigation.List>
      </Navigation.Root>
    )

    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toHaveAttribute('aria-current', 'page')
  })

  it('updates active state on click', async () => {
    const user = userEvent.setup()

    renderWithRouter(
      <Navigation.Root defaultValue="home">
        <Navigation.List>
          <Navigation.Item value="home" to="/">
            Home
          </Navigation.Item>
          <Navigation.Item value="about" to="/about">
            About
          </Navigation.Item>
        </Navigation.List>
      </Navigation.Root>
    )

    const aboutLink = screen.getByText('About')
    await user.click(aboutLink)

    expect(aboutLink.closest('a')).toHaveAttribute('aria-current', 'page')
  })

  it('renders with icon', () => {
    renderWithRouter(
      <Navigation.Root defaultValue="home">
        <Navigation.List>
          <Navigation.Item value="home" to="/" iconName="calendar_today">
            Home
          </Navigation.Item>
        </Navigation.List>
      </Navigation.Root>
    )

    const icon = screen.getByText('Home').parentElement?.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })
})

describe('Navigation - Controlled', () => {
  it('respects controlled value', () => {
    renderWithRouter(
      <Navigation.Root value="about">
        <Navigation.List>
          <Navigation.Item value="home" to="/">
            Home
          </Navigation.Item>
          <Navigation.Item value="about" to="/about">
            About
          </Navigation.Item>
        </Navigation.List>
      </Navigation.Root>
    )

    const aboutLink = screen.getByText('About').closest('a')
    expect(aboutLink).toHaveAttribute('aria-current', 'page')
  })

  it('calls onValueChange when item is clicked', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    renderWithRouter(
      <Navigation.Root value="home" onValueChange={handleChange}>
        <Navigation.List>
          <Navigation.Item value="home" to="/">
            Home
          </Navigation.Item>
          <Navigation.Item value="about" to="/about">
            About
          </Navigation.Item>
        </Navigation.List>
      </Navigation.Root>
    )

    const aboutLink = screen.getByText('About')
    await user.click(aboutLink)

    expect(handleChange).toHaveBeenCalledWith('about')
  })

  it('integrates with external state', async () => {
    const user = userEvent.setup()

    const ControlledNav = () => {
      const [active, setActive] = useState('home')

      return (
        <div>
          <p data-testid="active-state">{active}</p>
          <Navigation.Root value={active} onValueChange={setActive}>
            <Navigation.List>
              <Navigation.Item value="home" to="/">
                Home
              </Navigation.Item>
              <Navigation.Item value="about" to="/about">
                About
              </Navigation.Item>
            </Navigation.List>
          </Navigation.Root>
        </div>
      )
    }

    renderWithRouter(<ControlledNav />)

    expect(screen.getByTestId('active-state')).toHaveTextContent('home')

    const aboutLink = screen.getByText('About')
    await user.click(aboutLink)

    expect(screen.getByTestId('active-state')).toHaveTextContent('about')
  })
})

describe('Navigation.Item', () => {
  it('handles disabled state', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    renderWithRouter(
      <Navigation.Root value="home" onValueChange={handleChange}>
        <Navigation.List>
          <Navigation.Item value="home" to="/">
            Home
          </Navigation.Item>
          <Navigation.Item value="about" to="/about" disabled>
            About
          </Navigation.Item>
        </Navigation.List>
      </Navigation.Root>
    )

    const aboutLink = screen.getByText('About').closest('a')
    expect(aboutLink).toHaveAttribute('aria-disabled', 'true')

    await user.click(aboutLink!)
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('calls custom onClick handler', async () => {
    const user = userEvent.setup()
    const customClick = vi.fn()

    renderWithRouter(
      <Navigation.Root defaultValue="home">
        <Navigation.List>
          <Navigation.Item value="home" to="/" onClick={customClick}>
            Home
          </Navigation.Item>
        </Navigation.List>
      </Navigation.Root>
    )

    await user.click(screen.getByText('Home'))
    expect(customClick).toHaveBeenCalled()
  })

  it('has accessible attributes', () => {
    renderWithRouter(
      <Navigation.Root defaultValue="home">
        <Navigation.List>
          <Navigation.Item value="home" to="/" aria-label="Go to home page">
            Home
          </Navigation.Item>
        </Navigation.List>
      </Navigation.Root>
    )

    const link = screen.getByText('Home').closest('a')
    expect(link).toHaveAttribute('aria-label', 'Go to home page')
    expect(link).toHaveAttribute('aria-current', 'page')
  })
})

describe('Navigation.List', () => {
  it('has navigation role and label', () => {
    renderWithRouter(
      <Navigation.Root defaultValue="home">
        <Navigation.List>
          <Navigation.Item value="home" to="/">
            Home
          </Navigation.Item>
        </Navigation.List>
      </Navigation.Root>
    )

    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(nav).toBeInTheDocument()
  })
})
