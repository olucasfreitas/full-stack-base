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

export function ItemDetailPage({ itemId }: ItemDetailPageProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data: item } = useSuspenseQuery(itemDetailQueryOptions(itemId))
  const [editDraft, setEditDraft] = useState<ItemDraft>(() => toItemDraft(item))

  const parsedItemId = parseItemId(itemId)

  function updateTaskCaches(updatedItem: Awaited<ReturnType<typeof replaceItem>>) {
    queryClient.setQueryData(itemDetailQueryKey(itemId), updatedItem)
    queryClient.setQueryData<Item[] | undefined>(itemsListQueryKey, (currentItems) =>
      upsertItemInList(currentItems, updatedItem),
    )
  }

  const replaceMutation = useMutation({
    mutationFn: (payload: ItemDraft) => replaceItem(parsedItemId, payload),
    onSuccess: (updatedItem) => {
      setEditDraft(toItemDraft(updatedItem))
      updateTaskCaches(updatedItem)
      showToast({
        message: `Saved all changes to "${updatedItem.title}".`,
      })
    },
  })

  const patchTitleMutation = useMutation({
    mutationFn: (title: string) => patchItem(parsedItemId, { title }),
    onSuccess: (updatedItem) => {
      updateTaskCaches(updatedItem)
      setEditDraft((currentDraft) => ({
        ...currentDraft,
        title: updatedItem.title,
      }))

      showToast({
        message: 'Updated the task title.',
      })
    },
  })

  const patchDescriptionMutation = useMutation({
    mutationFn: (description: string) => patchItem(parsedItemId, { description }),
    onSuccess: (updatedItem) => {
      updateTaskCaches(updatedItem)
      setEditDraft((currentDraft) => ({
        ...currentDraft,
        description: updatedItem.description ?? '',
      }))

      showToast({
        message: 'Updated the task description.',
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

  const isSubmitting =
    replaceMutation.isPending ||
    patchTitleMutation.isPending ||
    patchDescriptionMutation.isPending ||
    deleteMutation.isPending
  const errorMessage = replaceMutation.error
    ? getErrorMessage(replaceMutation.error)
    : patchTitleMutation.error
      ? getErrorMessage(patchTitleMutation.error)
      : patchDescriptionMutation.error
        ? getErrorMessage(patchDescriptionMutation.error)
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
      onChange={setEditDraft}
      onSaveTitle={() => {
        patchTitleMutation.mutate(editDraft.title)
      }}
      onSaveDescription={() => {
        patchDescriptionMutation.mutate(editDraft.description)
      }}
      onSubmit={() => {
        replaceMutation.mutate(editDraft)
      }}
      onReset={() => {
        setEditDraft(toItemDraft(item))
      }}
      onDelete={() => {
        deleteMutation.mutate()
      }}
    />
  )
}
