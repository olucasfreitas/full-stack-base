import { render, screen } from '@testing-library/react'

import App from './App'

vi.mock('./features/items/components/items-dashboard', () => ({
  ItemsDashboard: () => <div>Items dashboard test double</div>,
}))

describe('App', () => {
  it('renders the starter shell heading', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: /react \+ nestjs starter wired end to end/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/items dashboard test double/i)).toBeInTheDocument()
  })
})
