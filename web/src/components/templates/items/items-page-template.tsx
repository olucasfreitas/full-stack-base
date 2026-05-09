import type { ReactNode } from 'react'

import { StatusBanner } from '@components/atoms/feedback/status-banner'
import { Panel } from '@components/atoms/layout/panel'

type ItemsPageTemplateProps = {
  createPanel: ReactNode
  collectionPanel: ReactNode
  detailPanel?: ReactNode
  errorMessage: string | null
}

export function ItemsPageTemplate({
  createPanel,
  collectionPanel,
  detailPanel,
  errorMessage,
}: ItemsPageTemplateProps) {
  return (
    <section className="grid w-full gap-6 lg:grid-cols-[minmax(340px,1fr)_minmax(0,1.5fr)]">
      <div>{createPanel}</div>

      <Panel as="section">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">Keep it simple</h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Open a task, edit what you need, and save once. One change uses PATCH;
            multiple changes use PUT automatically.
          </p>
        </div>

        {errorMessage ? <StatusBanner tone="error" message={errorMessage} /> : null}

        <div className="mt-6 space-y-4">
          {collectionPanel}
          {detailPanel ? detailPanel : null}
        </div>
      </Panel>
    </section>
  )
}
