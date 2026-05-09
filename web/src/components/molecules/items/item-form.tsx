import type { ItemDraft } from '../../../entities/item/types'

type ItemFormProps = {
  idPrefix: string
  title: string
  description?: string
  submitLabel: string
  values: ItemDraft
  busy?: boolean
  onChange: (next: ItemDraft) => void
  onSubmit: () => void
  onReset?: () => void
}

export function ItemForm({
  idPrefix,
  title,
  description,
  submitLabel,
  values,
  busy = false,
  onChange,
  onSubmit,
  onReset,
}: ItemFormProps) {
  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description ? <p className="text-sm text-slate-400">{description}</p> : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200" htmlFor={`${idPrefix}-title`}>
          Title
        </label>
        <input
          id={`${idPrefix}-title`}
          required
          value={values.title}
          onChange={(event) =>
            onChange({
              ...values,
              title: event.target.value,
            })
          }
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
          placeholder="Ship Codespaces-ready starter"
        />
      </div>

      <div className="space-y-2">
        <label
          className="text-sm font-medium text-slate-200"
          htmlFor={`${idPrefix}-description`}
        >
          Description
        </label>
        <textarea
          id={`${idPrefix}-description`}
          value={values.description}
          onChange={(event) =>
            onChange({
              ...values,
              description: event.target.value,
            })
          }
          className="min-h-28 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
          placeholder="Describe the work tracked by this sample item."
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
          className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-cyan-400 focus:ring-cyan-400"
        />
        Start with this item marked as completed
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-900 disabled:text-slate-300"
        >
          {busy ? 'Working...' : submitLabel}
        </button>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            Reset
          </button>
        ) : null}
      </div>
    </form>
  )
}
