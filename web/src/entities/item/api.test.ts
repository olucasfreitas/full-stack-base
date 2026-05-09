import { afterEach, describe, expect, it, vi } from 'vitest'

import { createItem } from './api'

describe('createItem', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the filled task form as JSON so the API can parse it', async () => {
    let capturedRequest: Request | undefined
    let capturedBody = ''

    const fetchMock = vi.fn(async (request: Request) => {
      capturedRequest = request
      capturedBody = await request.text()

      return new Response(
        JSON.stringify({
          id: 1,
          title: 'teste',
          description: 'description',
          completed: false,
          createdAt: '2026-05-09T21:40:00.000Z',
          updatedAt: '2026-05-09T21:40:00.000Z',
        }),
        {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    })

    vi.stubGlobal('fetch', fetchMock)

    await createItem({
      title: 'teste',
      description: 'description',
      completed: false,
    })

    expect(capturedRequest).toBeInstanceOf(Request)
    expect(capturedRequest?.headers.get('content-type')).toBe('application/json')
    expect(capturedBody).toBe(
      JSON.stringify({
        title: 'teste',
        description: 'description',
        completed: false,
      }),
    )
  })
})
