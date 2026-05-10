import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Navigation } from './index'
import { MemoryRouter } from 'react-router'

const renderWithRouter = (ui: React.ReactElement, initialEntries: string[] = ['/']) => {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>)
}

describe('Navigation.Item - URL based active state', () => {
  it('renders as active when URL matches (exact)', () => {
    renderWithRouter(
      <Navigation.List>
        <Navigation.Item to="/">Home</Navigation.Item>
        <Navigation.Item to="/about">About</Navigation.Item>
      </Navigation.List>,
      ['/']
    )

    const homeLink = screen.getByText('Home').closest('a')
    const aboutLink = screen.getByText('About').closest('a')

    expect(homeLink).toHaveClass('isActive_true')
    expect(aboutLink).not.toHaveClass('isActive_true')
  })

  it('updates active state when navigating', async () => {
    const user = userEvent.setup()

    renderWithRouter(
      <Navigation.List>
        <Navigation.Item to="/">Home</Navigation.Item>
        <Navigation.Item to="/about">About</Navigation.Item>
      </Navigation.List>,
      ['/']
    )

    const aboutLink = screen.getByText('About')
    await user.click(aboutLink)

    expect(aboutLink.closest('a')).toHaveClass('isActive_true')
  })

  it('renders with icon', () => {
    renderWithRouter(
      <Navigation.List>
        <Navigation.Item to="/" iconName="calendar_today">
          Home
        </Navigation.Item>
      </Navigation.List>
    )

    const icon = screen.getByText('Home').parentElement?.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('supports startsWith matching for nested routes', () => {
    renderWithRouter(
      <Navigation.List match="startsWith">
        <Navigation.Item to="/settings">Settings</Navigation.Item>
      </Navigation.List>,
      ['/settings/profile']
    )

    const settingsLink = screen.getByText('Settings').closest('a')
    expect(settingsLink).toHaveClass('isActive_true')
  })

  it('exact match does not activate for nested routes', () => {
    renderWithRouter(
      <Navigation.List>
        <Navigation.Item to="/settings">Settings</Navigation.Item>
      </Navigation.List>,
      ['/settings/profile']
    )

    const settingsLink = screen.getByText('Settings').closest('a')
    expect(settingsLink).not.toHaveClass('isActive_true')
  })
})

describe('Navigation.Item - render props', () => {
  it('supports className as function', () => {
    renderWithRouter(
      <Navigation.List>
        <Navigation.Item
          to="/"
          className={({ isActive }) => (isActive ? 'custom-active' : 'custom-inactive')}
        >
          Home
        </Navigation.Item>
      </Navigation.List>,
      ['/']
    )

    const homeLink = screen.getByText('Home').closest('a')
    expect(homeLink).toHaveClass('custom-active')
  })

  it('supports children as render function', () => {
    renderWithRouter(
      <Navigation.List>
        <Navigation.Item to="/">
          {({ isActive }) => (
            <span data-testid="render-child">{isActive ? 'Active Home' : 'Home'}</span>
          )}
        </Navigation.Item>
      </Navigation.List>,
      ['/']
    )

    expect(screen.getByTestId('render-child')).toHaveTextContent('Active Home')
  })
})

describe('Navigation.Item - disabled state', () => {
  it('handles disabled state', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    renderWithRouter(
      <Navigation.List>
        <Navigation.Item to="/">Home</Navigation.Item>
        <Navigation.Item to="/about" disabled onClick={handleClick}>
          About
        </Navigation.Item>
      </Navigation.List>
    )

    const aboutLink = screen.getByText('About').closest('a')
    expect(aboutLink).toHaveAttribute('aria-disabled', 'true')

    await user.click(aboutLink!)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('calls custom onClick handler when not disabled', async () => {
    const user = userEvent.setup()
    const customClick = vi.fn()

    renderWithRouter(
      <Navigation.List>
        <Navigation.Item to="/" onClick={customClick}>
          Home
        </Navigation.Item>
      </Navigation.List>
    )

    await user.click(screen.getByText('Home'))
    expect(customClick).toHaveBeenCalled()
  })
})

describe('Navigation.Item - accessibility', () => {
  it('has accessible attributes', () => {
    renderWithRouter(
      <Navigation.List>
        <Navigation.Item to="/" aria-label="Go to home page">
          Home
        </Navigation.Item>
      </Navigation.List>,
      ['/']
    )

    const link = screen.getByText('Home').closest('a')
    expect(link).toHaveAttribute('aria-label', 'Go to home page')
    expect(link).toHaveAttribute('aria-current', 'page')
  })
})

describe('Navigation.List', () => {
  it('has navigation role and label', () => {
    renderWithRouter(
      <Navigation.List>
        <Navigation.Item to="/">Home</Navigation.Item>
      </Navigation.List>
    )

    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(nav).toBeInTheDocument()
  })
})

describe('Navigation.Container', () => {
  it('renders as aside element', () => {
    renderWithRouter(
      <Navigation.Container>
        <Navigation.List>
          <Navigation.Item to="/">Home</Navigation.Item>
        </Navigation.List>
      </Navigation.Container>
    )

    const aside = document.querySelector('aside')
    expect(aside).toBeInTheDocument()
  })
})
