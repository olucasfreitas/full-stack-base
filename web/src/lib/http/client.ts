import ky, { TimeoutError, type Options } from 'ky'

const apiBaseUrl = (() => {
  const value = import.meta.env.VITE_API_BASE_URL ?? '/api/'
  const normalizedValue = value.endsWith('/') ? value : `${value}/`

  if (
    normalizedValue.startsWith('http://') ||
    normalizedValue.startsWith('https://')
  ) {
    return normalizedValue
  }

  if (typeof window !== 'undefined') {
    return new URL(normalizedValue, window.location.origin).toString()
  }

  return normalizedValue
})()

import { ApiError } from './errors'

export { ApiError }

export const apiClient = ky.create({
  baseUrl: apiBaseUrl,
  retry: 0,
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
  },
})

type ApiErrorBody = {
  message?: string | string[]
}

async function parseJsonBody(response: Response) {
  const responseClone = response.clone()
  const contentType = responseClone.headers.get('Content-Type') ?? ''

  if (!contentType.includes('application/json')) {
    return null
  }

  const text = await responseClone.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text) as ApiErrorBody
  } catch {
    return null
  }
}

export async function requestJson<T>(path: string, init: Options = {}) {
  try {
    const response = await apiClient(path, {
      ...init,
      throwHttpErrors: false,
    })

    if (!response.ok) {
      throw new ApiError(response, await parseJsonBody(response))
    }

    if (response.status === 204) {
      return undefined as T
    }

    return response.json<T>()
  } catch (error) {
    if (error instanceof TimeoutError) {
      throw new Error('The request timed out.', { cause: error })
    }

    throw error
  }
}
