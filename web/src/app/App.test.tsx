import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory } from '@tanstack/react-router'
import { render, screen, waitFor } from '@testing-library/react'

import { listItems } from '@entities/item/api'
import { createAppRouter } from '@router'

vi.mock('@entities/item/api', () => ({
  listItems: vi.fn().mockResolvedValue([]),
  getItem: vi.fn(),
  createItem: vi.fn(),
  replaceItem: vi.fn(),
  patchItem: vi.fn(),
  removeItem: vi.fn(),
}))

describe('App routing', () => {
  it('redirects the root path to /items and renders the items dashboard', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    const router = createAppRouter({
      history: createMemoryHistory({
        initialEntries: ['/'],
      }),
      queryClient,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    expect(
      await screen.findByRole('heading', {
        name: /react \+ nestjs starter wired end to end/i,
      }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/items')
    })

    expect(listItems).toHaveBeenCalled()
    expect(screen.getByRole('heading', { name: /item dashboard/i })).toBeInTheDocument()
  })
})
