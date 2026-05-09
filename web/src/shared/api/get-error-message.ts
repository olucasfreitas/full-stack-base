import { HTTPError } from 'ky'

export async function getErrorMessage(error: unknown) {
  if (error instanceof HTTPError) {
    const body = await error.response
      .json<{ message?: string | string[] }>()
      .catch(() => null)

    if (Array.isArray(body?.message)) {
      return body.message.join(', ')
    }

    if (typeof body?.message === 'string') {
      return body.message
    }

    return `${error.response.status} ${error.response.statusText}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred.'
}
