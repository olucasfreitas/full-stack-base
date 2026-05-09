import ky, { TimeoutError } from 'ky'

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

type ApiErrorBody = {
  message?: string | string[]
}

export class ApiError extends Error {
  response: Response
  body: ApiErrorBody | null

  constructor(response: Response, body: ApiErrorBody | null, cause?: unknown) {
    super(`${response.status} ${response.statusText}`, { cause })
    this.name = 'ApiError'
    this.response = response
    this.body = body
  }
}

export const apiClient = ky.create({
  baseUrl: apiBaseUrl,
  retry: 0,
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
  },
})

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

  return JSON.parse(text) as ApiErrorBody
}

export async function requestJson<T>(path: string, init: RequestInit = {}) {
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
