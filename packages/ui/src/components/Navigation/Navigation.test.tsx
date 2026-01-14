import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Container } from './Container'
import { List } from './List'
import { Item } from './Item'
import { MemoryRouter } from 'react-router'

// Navigation 컴포넌트들은 react-router의 Link를 사용하므로 Router로 감싸야 함
const renderWithRouter = (ui: React.ReactElement, initialEntries: string[] = ['/']) => {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>)
}

describe('Navigation.Container', () => {
  it('renders children correctly', () => {
    const { getByText } = renderWithRouter(<Container>Navigation content</Container>)

    expect(getByText('Navigation content')).toBeInTheDocument()
  })

  it('renders as aside element', () => {
    const { container } = renderWithRouter(<Container>Content</Container>)

    expect(container.querySelector('aside')).toBeInTheDocument()
  })

  it('has navigation role', () => {
    const { getByRole } = renderWithRouter(<Container>Content</Container>)

    expect(getByRole('navigation')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = renderWithRouter(<Container className="custom-nav">Content</Container>)

    const aside = container.querySelector('aside')
    expect(aside).toHaveClass('custom-nav')
  })

  it('applies flex column layout', () => {
    const { container } = renderWithRouter(<Container>Content</Container>)

    const aside = container.querySelector('aside')
    expect(aside).toHaveClass(/display_flex/)
    expect(aside).toHaveClass(/flexDirection_column/)
  })
})

describe('Navigation.List', () => {
  it('renders children correctly', () => {
    const { getByText } = renderWithRouter(<List>List content</List>)

    expect(getByText('List content')).toBeInTheDocument()
  })

  it('renders as nav element', () => {
    const { container } = renderWithRouter(<List>Content</List>)

    expect(container.querySelector('nav')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = renderWithRouter(<List className="custom-list">Content</List>)

    const nav = container.querySelector('nav')
    expect(nav).toHaveClass('custom-list')
  })

  it('spreads rest props to nav element', () => {
    const { container } = renderWithRouter(<List data-testid="test-list">Content</List>)

    expect(container.querySelector('[data-testid="test-list"]')).toBeInTheDocument()
  })
})

describe('Navigation.Item', () => {
  it('renders label text', () => {
    const { getByText } = renderWithRouter(<Item id="home" to="/home" label="Home" />)

    expect(getByText('Home')).toBeInTheDocument()
  })

  it('renders as list item with link', () => {
    const { container } = renderWithRouter(<Item id="home" to="/home" label="Home" />)

    expect(container.querySelector('li')).toBeInTheDocument()
    expect(container.querySelector('a')).toBeInTheDocument()
  })

  it('renders link with correct href', () => {
    const { container } = renderWithRouter(
      <Item id="dashboard" to="/dashboard" label="Dashboard" />
    )

    const link = container.querySelector('a')
    expect(link).toHaveAttribute('href', '/dashboard')
  })

  it('applies id to link', () => {
    const { container } = renderWithRouter(<Item id="nav-home" to="/home" label="Home" />)

    const link = container.querySelector('a')
    expect(link).toHaveAttribute('id', 'nav-home')
  })

  it('renders icon when iconName is provided', () => {
    const { container } = renderWithRouter(
      <Item id="settings" to="/settings" label="Settings" iconName="setting" />
    )

    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('does not render icon when iconName is not provided', () => {
    const { container } = renderWithRouter(<Item id="home" to="/home" label="Home" />)

    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('renders children', () => {
    const { getByText } = renderWithRouter(
      <Item id="home" to="/home" label="Home">
        <span>Badge</span>
      </Item>
    )

    expect(getByText('Badge')).toBeInTheDocument()
  })

  it('applies active state class when isActive is true', () => {
    const { container } = renderWithRouter(<Item id="home" to="/home" label="Home" isActive />)

    const link = container.querySelector('a')
    expect(link).toHaveClass(/isActive_true/)
  })

  it('does not apply active state class when isActive is false', () => {
    const { container } = renderWithRouter(
      <Item id="home" to="/home" label="Home" isActive={false} />
    )

    const link = container.querySelector('a')
    expect(link).not.toHaveClass(/isActive_true/)
  })

  it('calls onClick when item is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    const { container } = renderWithRouter(
      <Item id="home" to="/home" label="Home" onClick={handleClick} />
    )

    const listItem = container.querySelector('li')!
    await user.click(listItem)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('prevents click and navigation when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    const { container } = renderWithRouter(
      <Item id="home" to="/home" label="Home" onClick={handleClick} disabled />
    )

    const listItem = container.querySelector('li')!
    await user.click(listItem)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies aria-disabled when disabled is true', () => {
    const { container } = renderWithRouter(<Item id="home" to="/home" label="Home" disabled />)

    const link = container.querySelector('a')
    expect(link).toHaveAttribute('aria-disabled', 'true')
  })
})

describe('Navigation compound components', () => {
  it('renders complete navigation structure', () => {
    const { container, getByText } = renderWithRouter(
      <Container>
        <List>
          <Item id="home" to="/home" label="Home" iconName="menu" isActive />
          <Item id="settings" to="/settings" label="Settings" iconName="setting" />
        </List>
      </Container>
    )

    expect(container.querySelector('aside')).toBeInTheDocument()
    expect(container.querySelector('nav')).toBeInTheDocument()
    expect(container.querySelectorAll('li')).toHaveLength(2)
    expect(getByText('Home')).toBeInTheDocument()
    expect(getByText('Settings')).toBeInTheDocument()
  })
})
