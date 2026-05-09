import type { ReactNode } from 'react'

import { StatusBanner } from '@components/atoms/feedback/status-banner'
import { Panel } from '@components/atoms/layout/panel'

type ItemsPageTemplateProps = {
  createPanel: ReactNode
  collectionPanel: ReactNode
  detailPanel: ReactNode
  isRefreshing: boolean
  errorMessage: string | null
  onRefresh: () => void
}

export function ItemsPageTemplate({
  createPanel,
  collectionPanel,
  detailPanel,
  isRefreshing,
  errorMessage,
  onRefresh,
}: ItemsPageTemplateProps) {
  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      {createPanel}

      <Panel as="article">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Item dashboard</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              The collection view uses <strong>GET /api/items</strong>, selecting a row
              calls <strong> GET /api/items/:id</strong>, and the detail panel exposes the
              remaining mutation routes.
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:text-slate-500"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh list'}
          </button>
        </div>

        {errorMessage ? <StatusBanner tone="error" message={errorMessage} /> : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          {collectionPanel}
          {detailPanel}
        </div>
      </Panel>
    </section>
  )
}
