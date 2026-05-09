import { useState } from 'react'

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router'

import { useToast } from '@hooks/use-toast'
import { patchItem, removeItem, replaceItem } from '@items/api'
import { ItemDetailPanel } from '@items/components/item-detail-panel'
import { emptyItemDraft, toItemDraft } from '@items/draft'
import {
  itemDetailQueryKey,
  itemDetailQueryOptions,
  itemsListQueryKey,
  parseItemId,
  removeItemFromList,
  upsertItemInList,
} from '@items/queries'
import type { Item, ItemDraft } from '@items/types'
import { ApiError } from '@lib/http/client'
import { getErrorMessage } from '@lib/http/errors'

function noop() {}

function noopDraftChange() {}

function ItemRoutePending() {
  return (
    <ItemDetailPanel
      item={null}
      values={emptyItemDraft}
      busy={false}
      isLoading={true}
      saveDisabled={true}
      onChange={noopDraftChange}
      onSubmit={noop}
      onReset={noop}
      onDelete={noop}
    />
  )
}

function ItemRouteError({ error }: { error: Error }) {
  return (
    <section className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm leading-6 text-rose-100">
      <h3 className="text-lg font-semibold text-white">Unable to load this task</h3>
      <p className="mt-3">{error.message}</p>
    </section>
  )
}

function ItemRouteNotFound() {
  return (
    <section className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-4 text-sm leading-6 text-slate-300">
      <h3 className="text-lg font-semibold text-white">Task not found</h3>
      <p className="mt-3">
        The selected task does not exist anymore. Choose another task from the list.
      </p>
    </section>
  )
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

function ItemDetailPage({ itemId }: { itemId: string }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { data: item } = useSuspenseQuery(itemDetailQueryOptions(itemId))
  const [editDraft, setEditDraft] = useState<ItemDraft>(() => toItemDraft(item))

  const parsedItemId = parseItemId(itemId)
  const savedDraft = toItemDraft(item)
  const hasChanges = Object.keys(getItemChanges(savedDraft, editDraft)).length > 0

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

export const Route = createFileRoute('/items/$itemId')({
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(
        itemDetailQueryOptions(params.itemId),
      )
    } catch (error) {
      if (error instanceof ApiError && error.response.status === 404) {
        throw notFound()
      }

      throw error
    }
  },
  component: function ItemDetailRouteComponent() {
    const { itemId } = Route.useParams()

    return <ItemDetailPage key={itemId} itemId={itemId} />
  },
  pendingComponent: ItemRoutePending,
  errorComponent: ItemRouteError,
  notFoundComponent: ItemRouteNotFound,
})
