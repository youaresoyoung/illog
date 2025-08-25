import { Link } from 'react-router'

export const LeftPanel = () => {
  return (
    <nav
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '256px',
        borderRight: '1px solid #ccc',
        padding: '12px'
      }}
    >
      <Link to="/">Today</Link>
      <Link to="/this-week">This Week</Link>
      <Link to="/reflection">Reflection</Link>
    </nav>
  )
}
