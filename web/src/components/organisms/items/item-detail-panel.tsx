import { StatusBanner } from '@components/atoms/feedback/status-banner'
import type { Item, ItemDraft } from '@entities/item/types'

type ItemDetailPanelProps = {
  item: Item | null
  values: ItemDraft
  busy: boolean
  isLoading: boolean
  errorMessage?: string | null
  saveDisabled: boolean
  onChange: (next: ItemDraft) => void
  onSubmit: () => void
  onReset: () => void
  onDelete: () => void
}

export function ItemDetailPanel({
  item,
  values,
  busy,
  isLoading,
  errorMessage = null,
  saveDisabled,
  onChange,
  onSubmit,
  onReset,
  onDelete,
}: ItemDetailPanelProps) {
  return (
    <section
      aria-label="Edit task"
      aria-busy={busy}
      className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 lg:sticky lg:top-6"
    >
      <div className="mb-4 space-y-2">
        <h3 className="text-lg font-semibold text-white">Edit task</h3>
        <p className="text-sm leading-6 text-slate-400">
          Save once. One changed field uses PATCH; multiple changes use PUT.
        </p>
      </div>

      {errorMessage ? <StatusBanner tone="error" message={errorMessage} /> : null}

      {isLoading ? (
        <p className="text-sm text-slate-400">Loading task details...</p>
      ) : item ? (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault()

            if (busy || saveDisabled) {
              return
            }

            onSubmit()
          }}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="edit-task-title">
              Task title
            </label>
            <input
              id="edit-task-title"
              value={values.title}
              onChange={(event) =>
                onChange({
                  ...values,
                  title: event.target.value,
                })
              }
              disabled={busy}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              placeholder="Pay rent"
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="edit-task-description"
            >
              Task description
            </label>
            <textarea
              id="edit-task-description"
              value={values.description}
              onChange={(event) =>
                onChange({
                  ...values,
                  description: event.target.value,
                })
              }
              disabled={busy}
              className="min-h-28 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
              placeholder="Add a note if you need one."
            />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/50 px-4 py-3 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={values.completed}
              onChange={(event) =>
                onChange({
                  ...values,
                  completed: event.target.checked,
                })
              }
              disabled={busy}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-400 focus:ring-cyan-400"
            />
            Mark task as completed
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={busy || saveDisabled}
              className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400 hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={onReset}
              disabled={busy}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={busy}
              className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:border-rose-400 hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Delete task
            </button>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-700 px-4 py-8 text-sm leading-6 text-slate-400">
          Select a task from the list to edit it.
        </div>
      )}
    </section>
  )
}
