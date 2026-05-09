import { requestJson } from '@lib/http/client'

import type { CreateItemInput, Item, PatchItemInput, ReplaceItemInput } from './types'

export async function listItems() {
  return requestJson<Item[]>('items')
}

export async function getItem(id: number) {
  return requestJson<Item>(`items/${id}`)
}

export async function createItem(payload: CreateItemInput) {
  return requestJson<Item>('items', {
    method: 'POST',
    json: payload,
  })
}

export async function replaceItem(id: number, payload: ReplaceItemInput) {
  return requestJson<Item>(`items/${id}`, {
    method: 'PUT',
    json: payload,
  })
}

export async function patchItem(id: number, payload: PatchItemInput) {
  return requestJson<Item>(`items/${id}`, {
    method: 'PATCH',
    json: payload,
  })
}

export async function removeItem(id: number) {
  await requestJson<void>(`items/${id}`, {
    method: 'DELETE',
  })
}
