import { createFileRoute } from '@tanstack/react-router'

import { ItemDetailPanel } from '@components/organisms/items/item-detail-panel'
import { emptyItemDraft } from '@entities/item/draft'
import { itemDetailQueryOptions } from '@entities/item/queries'
import { ItemDetailPage } from '@pages/items/item-detail-page'

function noop() {}

function noopDraftChange() {}

function ItemRoutePending() {
  return (
    <ItemDetailPanel
      item={null}
      values={emptyItemDraft}
      busy={false}
      isLoading={true}
      onChange={noopDraftChange}
      onSubmit={noop}
      onReset={noop}
      onToggleCompletion={noop}
      onDelete={noop}
    />
  )
}

function ItemRouteError({ error }: { error: Error }) {
  return (
    <section className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm leading-6 text-rose-100">
      <h3 className="text-lg font-semibold text-white">Unable to load this item</h3>
      <p className="mt-3">{error.message}</p>
    </section>
  )
}

export const Route = createFileRoute('/items/$itemId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(itemDetailQueryOptions(params.itemId)),
  component: function ItemDetailRouteComponent() {
    const { itemId } = Route.useParams()

    return <ItemDetailPage key={itemId} itemId={itemId} />
  },
  pendingComponent: ItemRoutePending,
  errorComponent: ItemRouteError,
})
