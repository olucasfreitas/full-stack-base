import { queryOptions } from '@tanstack/react-query'

import type { Item } from './types'

import { getItem, listItems } from './api'

export const itemsListQueryKey = ['items'] as const

export function parseItemId(itemId: string) {
  const parsedId = Number(itemId)

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new Error('The item id in the URL is invalid.')
  }

  return parsedId
}

export function itemsListQueryOptions() {
  return queryOptions({
    queryKey: itemsListQueryKey,
    queryFn: listItems,
  })
}

export function itemDetailQueryKey(itemId: string) {
  return [...itemsListQueryKey, 'detail', itemId] as const
}

export function itemDetailQueryOptions(itemId: string) {
  return queryOptions({
    queryKey: itemDetailQueryKey(itemId),
    queryFn: async () => {
      const parsedId = parseItemId(itemId)
      return getItem(parsedId)
    },
  })
}

export function upsertItemInList(
  items: Item[] | undefined,
  updatedItem: Item,
) {
  const nextItems = items ?? []
  return [updatedItem, ...nextItems.filter((item) => item.id !== updatedItem.id)]
}

export function removeItemFromList(items: Item[] | undefined, itemId: number) {
  return (items ?? []).filter((item) => item.id !== itemId)
}
