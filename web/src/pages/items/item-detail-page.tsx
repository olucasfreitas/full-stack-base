import { useState } from 'react'

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { useToast } from '@app/use-toast'
import { ItemDetailPanel } from '@components/organisms/items/item-detail-panel'
import { patchItem, removeItem, replaceItem } from '@entities/item/api'
import { toItemDraft } from '@entities/item/draft'
import {
  itemDetailQueryKey,
  itemDetailQueryOptions,
  itemsListQueryKey,
  parseItemId,
  removeItemFromList,
  upsertItemInList,
} from '@entities/item/queries'
import type { Item, ItemDraft } from '@entities/item/types'
import { getErrorMessage } from '@shared/api/get-error-message'

type ItemDetailPageProps = {
  itemId: string
}

function getItemChanges(savedDraft: ItemDraft, nextDraft: ItemDraft) {
  const changes: Partial<ItemDraft> = {}

  if (savedDraft.title !== nextDraft.title) {
    changes.title = nextDraft.title
  }

  if (savedDraft.description !== nextDraft.description) {
    changes.description = nextDraft.description
  }

  if (savedDraft.completed !== nextDraft.completed) {
    changes.completed = nextDraft.completed
  }

  return changes
}

export function ItemDetailPage({ itemId }: ItemDetailPageProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data: item } = useSuspenseQuery(itemDetailQueryOptions(itemId))
  const [editDraft, setEditDraft] = useState<ItemDraft>(() => toItemDraft(item))

  const parsedItemId = parseItemId(itemId)
  const savedDraft = toItemDraft(item)
  const pendingChanges = getItemChanges(savedDraft, editDraft)
  const hasChanges = Object.keys(pendingChanges).length > 0

  function updateTaskCaches(updatedItem: Item) {
    queryClient.setQueryData(itemDetailQueryKey(itemId), updatedItem)
    queryClient.setQueryData<Item[] | undefined>(itemsListQueryKey, (currentItems) =>
      upsertItemInList(currentItems, updatedItem),
    )
  }

  const saveMutation = useMutation({
    mutationFn: (payload: ItemDraft) => {
      const changes = getItemChanges(savedDraft, payload)

      if (Object.keys(changes).length === 1) {
        return patchItem(parsedItemId, changes)
      }

      return replaceItem(parsedItemId, payload)
    },
    onSuccess: async (updatedItem) => {
      updateTaskCaches(updatedItem)
      await navigate({ to: '/items' })

      showToast({
        message: `Saved "${updatedItem.title}".`,
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => removeItem(parsedItemId),
    onSuccess: async () => {
      queryClient.setQueryData<Item[] | undefined>(itemsListQueryKey, (currentItems) =>
        removeItemFromList(currentItems, parsedItemId),
      )
      queryClient.removeQueries({
        queryKey: itemDetailQueryKey(itemId),
      })
      await navigate({ to: '/items' })

      showToast({
        message: 'Deleted the task.',
      })
    },
  })

  const isSubmitting = saveMutation.isPending || deleteMutation.isPending
  const errorMessage = saveMutation.error
    ? getErrorMessage(saveMutation.error)
    : deleteMutation.error
      ? getErrorMessage(deleteMutation.error)
      : null

  return (
    <ItemDetailPanel
      item={item}
      values={editDraft}
      busy={isSubmitting}
      isLoading={false}
      errorMessage={errorMessage}
      saveDisabled={!hasChanges}
      onChange={setEditDraft}
      onSubmit={() => {
        if (!hasChanges) {
          return
        }

        saveMutation.mutate(editDraft)
      }}
      onReset={() => {
        setEditDraft(savedDraft)
      }}
      onDelete={() => {
        deleteMutation.mutate()
      }}
    />
  )
}
