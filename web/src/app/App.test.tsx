import { RouterProvider, createMemoryHistory } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'

import { createAppRouter } from '@router'

describe('App', () => {
  it('renders the heading and health check button', async () => {
    const router = createAppRouter({
      history: createMemoryHistory({ initialEntries: ['/'] }),
    })

    render(<RouterProvider router={router} />)

    expect(
      await screen.findByRole('heading', { name: /full stack base/i }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: /check api health/i }),
    ).toBeInTheDocument()
  })
})
