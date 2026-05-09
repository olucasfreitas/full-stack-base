import { useState } from 'react'

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { ItemDetailPanel } from '../../components/organisms/items/item-detail-panel'
import { patchItem, removeItem, replaceItem } from '../../entities/item/api'
import { toItemDraft } from '../../entities/item/draft'
import {
  itemDetailQueryKey,
  itemDetailQueryOptions,
  itemsListQueryKey,
  parseItemId,
} from '../../entities/item/queries'
import type { ItemDraft } from '../../entities/item/types'
import { getErrorMessage } from '../../shared/api/get-error-message'

type ItemDetailPageProps = {
  itemId: string
}

export function ItemDetailPage({ itemId }: ItemDetailPageProps) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data: item } = useSuspenseQuery(itemDetailQueryOptions(itemId))
  const [editDraft, setEditDraft] = useState<ItemDraft>(() => toItemDraft(item))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const parsedItemId = parseItemId(itemId)

  const replaceMutation = useMutation({
    mutationFn: (payload: ItemDraft) => replaceItem(parsedItemId, payload),
    onSuccess: async (updatedItem) => {
      setErrorMessage(null)
      setStatusMessage(`Replaced item #${updatedItem.id} with PUT.`)
      setEditDraft(toItemDraft(updatedItem))
      queryClient.setQueryData(itemDetailQueryKey(itemId), updatedItem)

      await queryClient.invalidateQueries({
        queryKey: itemsListQueryKey,
      })
      await queryClient.invalidateQueries({
        queryKey: itemDetailQueryKey(itemId),
      })
    },
    onError: async (error) => {
      setStatusMessage(null)
      setErrorMessage(await getErrorMessage(error))
    },
  })

  const patchMutation = useMutation({
    mutationFn: () =>
      patchItem(parsedItemId, {
        completed: !item.completed,
      }),
    onSuccess: async (updatedItem) => {
      setErrorMessage(null)
      setStatusMessage(
        updatedItem.completed
          ? `Patched item #${updatedItem.id} to completed.`
          : `Patched item #${updatedItem.id} to pending.`,
      )
      setEditDraft(toItemDraft(updatedItem))
      queryClient.setQueryData(itemDetailQueryKey(itemId), updatedItem)

      await queryClient.invalidateQueries({
        queryKey: itemsListQueryKey,
      })
      await queryClient.invalidateQueries({
        queryKey: itemDetailQueryKey(itemId),
      })
    },
    onError: async (error) => {
      setStatusMessage(null)
      setErrorMessage(await getErrorMessage(error))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => removeItem(parsedItemId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: itemsListQueryKey,
      })
      queryClient.removeQueries({
        queryKey: itemDetailQueryKey(itemId),
      })
      await navigate({ to: '/items' })
    },
    onError: async (error) => {
      setStatusMessage(null)
      setErrorMessage(await getErrorMessage(error))
    },
  })

  const isSubmitting =
    replaceMutation.isPending || patchMutation.isPending || deleteMutation.isPending

  return (
    <ItemDetailPanel
      item={item}
      values={editDraft}
      busy={isSubmitting}
      isLoading={false}
      errorMessage={errorMessage}
      statusMessage={statusMessage}
      onChange={setEditDraft}
      onSubmit={() => {
        void replaceMutation.mutateAsync(editDraft)
      }}
      onReset={() => {
        setEditDraft(toItemDraft(item))
      }}
      onToggleCompletion={() => {
        void patchMutation.mutateAsync()
      }}
      onDelete={() => {
        void deleteMutation.mutateAsync()
      }}
    />
  )
}
