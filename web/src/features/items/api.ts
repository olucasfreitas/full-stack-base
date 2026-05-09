import { HTTPError } from 'ky'

import { apiClient } from '../../api/client'
import type { CreateItemInput, Item, PatchItemInput, ReplaceItemInput } from './types'

export async function listItems() {
  return apiClient.get('items').json<Item[]>()
}

export async function getItem(id: number) {
  return apiClient.get(`items/${id}`).json<Item>()
}

export async function createItem(payload: CreateItemInput) {
  return apiClient.post('items', { json: payload }).json<Item>()
}

export async function replaceItem(id: number, payload: ReplaceItemInput) {
  return apiClient.put(`items/${id}`, { json: payload }).json<Item>()
}

export async function patchItem(id: number, payload: PatchItemInput) {
  return apiClient.patch(`items/${id}`, { json: payload }).json<Item>()
}

export async function removeItem(id: number) {
  await apiClient.delete(`items/${id}`)
}

export async function getErrorMessage(error: unknown) {
  if (error instanceof HTTPError) {
    const body = await error.response.json<{ message?: string | string[] }>().catch(() => null)

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
