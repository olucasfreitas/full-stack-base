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
  const contentClassName = detailPanel
    ? 'mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.95fr)] lg:items-start'
    : 'mt-6 space-y-4'

  return (
    <section className="w-full space-y-6">
      {createPanel}

      <Panel as="section">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">Keep it simple</h2>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Open a task, edit what you need, and save once. One change uses PATCH;
            multiple changes use PUT automatically.
          </p>
        </div>

        {errorMessage ? <StatusBanner tone="error" message={errorMessage} /> : null}

        <div className={contentClassName}>
          {collectionPanel}
          {detailPanel ? detailPanel : null}
        </div>
      </Panel>
    </section>
  )
}
