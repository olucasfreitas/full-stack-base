import type { Item } from '@entities/item/types'

type ItemListCardProps = {
  item: Item
  selected: boolean
  busy?: boolean
  onSelect: (id: number) => void
  onToggleCompletion: (item: Item) => void
  onDelete: (item: Item) => void
}

export function ItemListCard({
  item,
  selected,
  busy = false,
  onSelect,
  onToggleCompletion,
  onDelete,
}: ItemListCardProps) {
  return (
    <article
      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
        selected
          ? 'border-cyan-400 bg-cyan-400/10'
          : 'border-slate-800 bg-slate-900 hover:border-slate-600'
      }`}
    >
      <div className="flex items-start gap-3">
        <button type="button" onClick={() => onSelect(item.id)} className="flex-1 text-left">
          <p className="font-medium text-white">{item.title}</p>
          {item.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-slate-400">{item.description}</p>
          ) : null}
        </button>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleCompletion(item)}
            disabled={busy}
            aria-label={item.completed ? 'Mark task as pending' : 'Mark task as completed'}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
              item.completed
                ? 'bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25'
                : 'bg-amber-500/15 text-amber-200 hover:bg-amber-500/25'
            }`}
          >
            {item.completed ? 'Completed' : 'Pending'}
          </button>

          <button
            type="button"
            onClick={() => onDelete(item)}
            disabled={busy}
            aria-label={`Delete ${item.title}`}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-500/15 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}
