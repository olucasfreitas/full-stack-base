import { queryOptions } from '@tanstack/react-query'

import { ApiError } from '@shared/api/client'

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

      try {
        return await getItem(parsedId)
      } catch (error) {
        if (error instanceof ApiError && error.response.status === 404) {
          throw new Error(`Item #${parsedId} was not found.`, { cause: error })
        }

        throw error
      }
    },
  })
}
