import { createFileRoute, notFound } from '@tanstack/react-router'

import { ItemDetailPanel } from '@components/organisms/items/item-detail-panel'
import { emptyItemDraft } from '@entities/item/draft'
import { itemDetailQueryOptions } from '@entities/item/queries'
import { ItemDetailPage } from '@pages/items/item-detail-page'
import { ApiError } from '@shared/api/client'

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
