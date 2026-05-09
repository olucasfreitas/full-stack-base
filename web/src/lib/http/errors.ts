export class ApiError extends Error {
  response: Response
  body: { message?: string | string[] } | null

  constructor(
    response: Response,
    body: { message?: string | string[] } | null,
    cause?: unknown,
  ) {
    super(`${response.status} ${response.statusText}`, { cause })
    this.name = 'ApiError'
    this.response = response
    this.body = body
  }
}

function getApiMessage(body: { message?: string | string[] } | null) {
  if (Array.isArray(body?.message)) {
    return body.message.join(', ')
  }

  if (typeof body?.message === 'string') {
    return body.message
  }

  return null
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    const message = getApiMessage(error.body)

    if (message) {
      return message
    }

    return `${error.response.status} ${error.response.statusText}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred.'
}
