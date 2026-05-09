import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError, apiClient, requestJson } from './client'
import { getErrorMessage } from './get-error-message'

describe('requestJson', () => {
  it('exports the shared ky client used by the API layer', () => {
    expect(apiClient).toBeDefined()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses the shared API base path for successful JSON requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ id: 1 }]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    vi.stubGlobal('fetch', fetchMock)

    await expect(requestJson<Array<{ id: number }>>('items')).resolves.toEqual([{ id: 1 }])

    const request = fetchMock.mock.calls[0]?.[0]

    expect(request).toBeInstanceOf(Request)
    expect((request as Request).url).toBe('http://localhost:3000/api/items')
    expect((request as Request).headers.get('accept')).toBe('application/json')
  })

  it('returns undefined for successful no-content requests', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 204,
        }),
      ),
    )

    await expect(
      requestJson<void>('items/1', {
        method: 'DELETE',
      }),
    ).resolves.toBeUndefined()
  })

  it('surfaces API response messages through the shared error helper', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: ['Title is required', 'Description is too long'] }), {
          status: 400,
          statusText: 'Bad Request',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ),
    )

    const error = await requestJson('items').catch((caughtError: unknown) => caughtError)

    expect(error).toBeInstanceOf(ApiError)
    expect(getErrorMessage(error)).toBe(
      'Title is required, Description is too long',
    )
  })

  it('falls back to the HTTP status when the API error body is malformed JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response('not valid json', {
          status: 502,
          statusText: 'Bad Gateway',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      ),
    )

    const error = await requestJson('items').catch((caughtError: unknown) => caughtError)

    expect(error).toBeInstanceOf(ApiError)
    expect(getErrorMessage(error)).toBe('502 Bad Gateway')
  })
})
