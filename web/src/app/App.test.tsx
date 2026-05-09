import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryHistory } from '@tanstack/react-router'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'

import { getItem, listItems, patchItem, replaceItem } from '@entities/item/api'
import { createAppRouter } from '@router'
import { ApiError } from '@shared/api/client'

vi.mock('@entities/item/api', () => ({
  listItems: vi.fn().mockResolvedValue([]),
  getItem: vi.fn(),
  createItem: vi.fn(),
  replaceItem: vi.fn(),
  patchItem: vi.fn(),
  removeItem: vi.fn(),
}))

const baseItem = {
  id: 1,
  title: 'Pay rent',
  description: 'Transfer the payment tonight.',
  completed: false,
  createdAt: '2026-05-09T20:00:00.000Z',
  updatedAt: '2026-05-09T20:00:00.000Z',
}

describe('App routing', () => {
  beforeEach(() => {
    vi.mocked(listItems).mockResolvedValue([])
    vi.mocked(getItem).mockResolvedValue(baseItem)
    vi.mocked(patchItem).mockResolvedValue({
      ...baseItem,
      title: 'Pay utilities',
      updatedAt: '2026-05-09T21:00:00.000Z',
    })
    vi.mocked(replaceItem).mockResolvedValue({
      ...baseItem,
      title: 'Pay utilities',
      description: 'Pay rent and power bills.',
      completed: true,
      updatedAt: '2026-05-09T21:05:00.000Z',
    })
  })

  it('redirects the root path to /items and renders the simpler tasks screen', async () => {
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
        name: /^tasks$/i,
      }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/items')
    })

    expect(listItems).toHaveBeenCalled()
    expect(screen.queryByRole('heading', { name: /item dashboard/i })).not.toBeInTheDocument()
  })

  it('uses PATCH when only the title field is edited', async () => {
    vi.mocked(listItems).mockResolvedValue([baseItem])

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    const router = createAppRouter({
      history: createMemoryHistory({
        initialEntries: ['/items/1'],
      }),
      queryClient,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    const editor = await screen.findByRole('region', { name: /edit task/i })

    fireEvent.change(within(editor).getByLabelText(/task title/i), {
      target: { value: 'Pay utilities' },
    })
    fireEvent.click(within(editor).getByRole('button', { name: /save changes/i }))

    await waitFor(() => {
      expect(patchItem).toHaveBeenCalledWith(1, { title: 'Pay utilities' })
    })
    expect(replaceItem).not.toHaveBeenCalled()

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/items')
    })
    expect(screen.queryByRole('region', { name: /edit task/i })).not.toBeInTheDocument()
  })

  it('keeps the selected task editor open when the same task is clicked again', async () => {
    vi.mocked(listItems).mockResolvedValue([baseItem])

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    const router = createAppRouter({
      history: createMemoryHistory({
        initialEntries: ['/items/1'],
      }),
      queryClient,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    expect(
      await screen.findByRole('region', { name: /edit task/i }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /pay rent/i }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/items/1')
    })

    expect(
      screen.getByRole('region', { name: /edit task/i }),
    ).toBeInTheDocument()
  })

  it('uses PUT when the full task form is submitted', async () => {
    vi.mocked(listItems).mockResolvedValue([baseItem])

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    const router = createAppRouter({
      history: createMemoryHistory({
        initialEntries: ['/items/1'],
      }),
      queryClient,
    })

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    const editor = await screen.findByRole('region', { name: /edit task/i })

    fireEvent.change(within(editor).getByLabelText(/task title/i), {
      target: { value: 'Pay utilities' },
    })
    fireEvent.change(within(editor).getByLabelText(/task description/i), {
      target: { value: 'Pay rent and power bills.' },
    })
    fireEvent.click(within(editor).getByLabelText(/mark task as completed/i))
    fireEvent.click(
      within(editor).getByRole('button', { name: /save changes/i }),
    )

    await waitFor(() => {
      expect(replaceItem).toHaveBeenCalledWith(1, {
        title: 'Pay utilities',
        description: 'Pay rent and power bills.',
        completed: true,
      })
    })
  })

  it('renders the route not-found state when a selected task no longer exists', async () => {
    vi.mocked(listItems).mockResolvedValue([baseItem])
    vi.mocked(getItem).mockRejectedValue(
      new ApiError(
        new Response(
          JSON.stringify({
            message: ['Item 999 was not found.'],
          }),
          {
            status: 404,
            statusText: 'Not Found',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
        {
          message: ['Item 999 was not found.'],
        },
      ),
    )

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    const router = createAppRouter({
      history: createMemoryHistory({
        initialEntries: ['/items/999'],
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
        name: /task not found/i,
      }),
    ).toBeInTheDocument()
  })
})
