import { ItemStatusBadge } from '@components/atoms/items/item-status-badge'
import type { Item } from '@entities/item/types'

type ItemListCardProps = {
  item: Item
  selected: boolean
  busy?: boolean
  onSelect: (id: number) => void
  onToggleCompletion: (item: Item) => void
}

export function ItemListCard({
  item,
  selected,
  busy = false,
  onSelect,
  onToggleCompletion,
}: ItemListCardProps) {
  return (
    <article
      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
        selected
          ? 'border-cyan-400 bg-cyan-400/10'
          : 'border-slate-800 bg-slate-900 hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={() => onSelect(item.id)} className="flex-1 text-left">
          <p className="font-medium text-white">{item.title}</p>
          {item.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-slate-400">{item.description}</p>
          ) : null}
        </button>
        <button
          type="button"
          onClick={() => onToggleCompletion(item)}
          disabled={busy}
          aria-label={item.completed ? 'Mark task as pending' : 'Mark task as completed'}
          className="shrink-0 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ItemStatusBadge completed={item.completed} />
        </button>
      </div>
    </article>
  )
}
