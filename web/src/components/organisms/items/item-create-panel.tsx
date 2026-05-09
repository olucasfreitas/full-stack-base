import { Panel } from '@components/atoms/layout/panel'
import { ItemForm } from '@components/molecules/items/item-form'
import type { ItemDraft } from '@entities/item/types'

type ItemCreatePanelProps = {
  values: ItemDraft
  busy: boolean
  onChange: (next: ItemDraft) => void
  onSubmit: () => void
  onReset: () => void
}

export function ItemCreatePanel({
  values,
  busy,
  onChange,
  onSubmit,
  onReset,
}: ItemCreatePanelProps) {
  return (
    <Panel as="article">
      <ItemForm
        idPrefix="create-item"
        title="Create an item"
        description="This form issues a POST request to the API and immediately reloads both the collection and the selected detail view."
        submitLabel="Create with POST"
        values={values}
        busy={busy}
        onChange={onChange}
        onSubmit={onSubmit}
        onReset={onReset}
      />

      <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
        <p className="font-medium text-white">Frontend API strategy</p>
        <p className="mt-2 leading-6">
          The browser talks to a relative{' '}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-300">/api</code>{' '}
          path through a shared{' '}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-300">ky</code>{' '}
          helper, and Vite proxies that traffic to Nest during development.
        </p>
      </div>
    </Panel>
  )
}
