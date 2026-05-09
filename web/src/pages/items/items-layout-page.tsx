import { useState } from 'react'

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Outlet, useNavigate, useParams } from '@tanstack/react-router'

import { useToast } from '@app/use-toast'
import { ItemCollectionPanel } from '@components/organisms/items/item-collection-panel'
import { ItemCreatePanel } from '@components/organisms/items/item-create-panel'
import { ItemsPageTemplate } from '@components/templates/items/items-page-template'
import { createItem, patchItem } from '@entities/item/api'
import { emptyItemDraft } from '@entities/item/draft'
import {
  itemDetailQueryKey,
  itemsListQueryKey,
  itemsListQueryOptions,
  upsertItemInList,
} from '@entities/item/queries'
import type { Item, ItemDraft } from '@entities/item/types'
import { getErrorMessage } from '@shared/api/get-error-message'

function getSelectedItemId(itemId: string | undefined) {
  const parsedId = Number(itemId)

  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null
}

export function ItemsLayoutPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { itemId } = useParams({ strict: false })
  const [createDraft, setCreateDraft] = useState<ItemDraft>(emptyItemDraft)
  const selectedItemId = getSelectedItemId(itemId)

  const itemsQuery = useSuspenseQuery(itemsListQueryOptions())

  const createMutation = useMutation({
    mutationFn: createItem,
    onSuccess: (createdItem) => {
      setCreateDraft(emptyItemDraft)
      queryClient.setQueryData<Item[] | undefined>(itemsListQueryKey, (currentItems) =>
        upsertItemInList(currentItems, createdItem),
      )
      showToast({
        message: `Added "${createdItem.title}".`,
      })
    },
  })

  const toggleCompletionMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      patchItem(id, { completed }),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData<Item[] | undefined>(itemsListQueryKey, (currentItems) =>
        upsertItemInList(currentItems, updatedItem),
      )
      queryClient.setQueryData(
        itemDetailQueryKey(String(updatedItem.id)),
        updatedItem,
      )

      showToast({
        message: updatedItem.completed
          ? `Marked "${updatedItem.title}" as completed.`
          : `Marked "${updatedItem.title}" as pending.`,
      })
    },
  })

  const errorMessage = createMutation.error
    ? getErrorMessage(createMutation.error)
    : toggleCompletionMutation.error
      ? getErrorMessage(toggleCompletionMutation.error)
      : null

  return (
    <ItemsPageTemplate
      createPanel={
        <ItemCreatePanel
          values={createDraft}
          busy={createMutation.isPending}
          onChange={setCreateDraft}
          onSubmit={() => {
            createMutation.mutate(createDraft)
          }}
          onReset={() => {
            setCreateDraft(emptyItemDraft)
          }}
        />
      }
      collectionPanel={
        <ItemCollectionPanel
          items={itemsQuery.data}
          selectedItemId={selectedItemId}
          isLoading={itemsQuery.isFetching && !itemsQuery.data.length}
          busyItemId={
            toggleCompletionMutation.isPending
              ? (toggleCompletionMutation.variables?.id ?? null)
              : null
          }
          onSelect={(nextItemId) => {
            if (selectedItemId === nextItemId) {
              return
            }

            void navigate({
              to: '/items/$itemId',
              params: { itemId: String(nextItemId) },
            })
          }}
          onToggleCompletion={(item) => {
            toggleCompletionMutation.mutate({
              id: item.id,
              completed: !item.completed,
            })
          }}
        />
      }
      detailPanel={<Outlet />}
      errorMessage={errorMessage}
    />
  )
}
