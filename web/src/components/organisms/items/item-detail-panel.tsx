import { StatusBanner } from '@components/atoms/feedback/status-banner'
import { ItemForm } from '@components/molecules/items/item-form'
import { ItemMetaSummary } from '@components/molecules/items/item-meta-summary'
import type { Item, ItemDraft } from '@entities/item/types'

type ItemDetailPanelProps = {
  item: Item | null
  values: ItemDraft
  busy: boolean
  isLoading: boolean
  errorMessage?: string | null
  onChange: (next: ItemDraft) => void
  onSubmit: () => void
  onReset: () => void
  onToggleCompletion: () => void
  onDelete: () => void
}

export function ItemDetailPanel({
  item,
  values,
  busy,
  isLoading,
  errorMessage = null,
  onChange,
  onSubmit,
  onReset,
  onToggleCompletion,
  onDelete,
}: ItemDetailPanelProps) {
  const selectedSummary = item
    ? `Selected item #${item.id} was last updated at ${new Date(item.updatedAt).toLocaleString()}.`
    : 'Choose an item to load the dedicated GET endpoint and enable the PUT, PATCH, and DELETE actions.'

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="mb-4 space-y-2">
        <h3 className="text-lg font-semibold text-white">Selected item</h3>
        <p className="text-sm leading-6 text-slate-400">{selectedSummary}</p>
      </div>

      {errorMessage ? <StatusBanner tone="error" message={errorMessage} /> : null}

      {isLoading ? (
        <p className="text-sm text-slate-400">Loading item details...</p>
      ) : item ? (
        <div className="space-y-6">
          <ItemMetaSummary item={item} />

          <ItemForm
            idPrefix="edit-item"
            title="Replace the selected item"
            description="Submitting this form sends a full PUT payload with the current title, description, and completed state."
            submitLabel="Replace with PUT"
            values={values}
            busy={busy}
            onChange={onChange}
            onSubmit={onSubmit}
            onReset={onReset}
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onToggleCompletion}
              disabled={busy}
              className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400 hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {item.completed ? 'Mark pending with PATCH' : 'Mark completed with PATCH'}
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:border-rose-400 hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Delete with DELETE
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 px-4 py-8 text-sm leading-6 text-slate-400">
          Select an item from the collection to load its dedicated detail route.
        </div>
      )}
    </section>
  )
}
