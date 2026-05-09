import { createFileRoute } from '@tanstack/react-router'

import { ItemCollectionPanel } from '@components/organisms/items/item-collection-panel'
import { ItemCreatePanel } from '@components/organisms/items/item-create-panel'
import { ItemsPageTemplate } from '@components/templates/items/items-page-template'
import { emptyItemDraft } from '@entities/item/draft'
import { itemsListQueryOptions } from '@entities/item/queries'
import { ItemsLayoutPage } from '@pages/items/items-layout-page'

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

export const Route = createFileRoute('/items')({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(itemsListQueryOptions()),
  component: ItemsLayoutPage,
  pendingComponent: ItemsRoutePending,
  errorComponent: ItemsRouteError,
})
