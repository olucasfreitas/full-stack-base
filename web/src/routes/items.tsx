import { useState } from 'react'

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Outlet, createFileRoute, useNavigate, useParams } from '@tanstack/react-router'

import { useToast } from '@hooks/use-toast'
import { createItem, patchItem, removeItem } from '@items/api'
import { ItemCollectionPanel } from '@items/components/item-collection-panel'
import { ItemCreatePanel } from '@items/components/item-create-panel'
import { ItemsPageTemplate } from '@items/components/items-page-template'
import { emptyItemDraft } from '@items/draft'
import {
  itemDetailQueryKey,
  itemsListQueryKey,
  itemsListQueryOptions,
  removeItemFromList,
  upsertItemInList,
} from '@items/queries'
import type { Item, ItemDraft } from '@items/types'
import { getErrorMessage } from '@lib/http/errors'

function getSelectedItemId(itemId: string | undefined) {
  const parsedId = Number(itemId)

  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null
}

function noop() {}

function noopDraftChange() {}

function ItemsRoutePending() {
  return (
    <ItemsPageTemplate
      createPanel={
        <ItemCreatePanel
          values={emptyItemDraft}
          busy={true}
          onChange={noopDraftChange}
          onSubmit={noop}
          onReset={noop}
        />
      }
      collectionPanel={
        <ItemCollectionPanel
          items={[]}
          selectedItemId={null}
          isLoading={true}
          onToggleCompletion={noop}
          onSelect={noop}
          onDelete={noop}
        />
      }
      detailPanel={null}
      errorMessage={null}
    />
  )
}

function ItemsRouteError({ error }: { error: Error }) {
  return (
    <section className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm leading-6 text-rose-100">
      <h2 className="text-xl font-semibold text-white">Unable to load items</h2>
      <p className="mt-3">{error.message}</p>
    </section>
  )
}

function ItemsLayoutPage() {
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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => removeItem(id),
    onSuccess: (_result, deletedId) => {
      queryClient.setQueryData<Item[] | undefined>(itemsListQueryKey, (currentItems) =>
        removeItemFromList(currentItems, deletedId),
      )
      queryClient.removeQueries({
        queryKey: itemDetailQueryKey(String(deletedId)),
      })

      if (selectedItemId === deletedId) {
        void navigate({ to: '/items' })
      }

      showToast({ message: 'Deleted the task.' })
    },
  })

  const errorMessage = createMutation.error
    ? getErrorMessage(createMutation.error)
    : toggleCompletionMutation.error
      ? getErrorMessage(toggleCompletionMutation.error)
      : deleteMutation.error
        ? getErrorMessage(deleteMutation.error)
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
          onDelete={(item) => {
            deleteMutation.mutate(item.id)
          }}
        />
      }
      detailPanel={<Outlet />}
      errorMessage={errorMessage}
    />
  )
}

export const Route = createFileRoute('/items')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(itemsListQueryOptions()),
  component: ItemsLayoutPage,
  pendingComponent: ItemsRoutePending,
  errorComponent: ItemsRouteError,
})
