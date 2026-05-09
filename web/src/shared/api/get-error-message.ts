import { ApiError } from './client'

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
