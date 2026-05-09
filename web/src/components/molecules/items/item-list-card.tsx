import { ItemStatusBadge } from '@components/atoms/items/item-status-badge'
import type { Item } from '@entities/item/types'

type ItemListCardProps = {
  item: Item
  selected: boolean
  onSelect: (id: number) => void
}

export function ItemListCard({ item, selected, onSelect }: ItemListCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
        selected
          ? 'border-cyan-400 bg-cyan-400/10'
          : 'border-slate-800 bg-slate-900 hover:border-slate-600'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-white">{item.title}</p>
          <p className="mt-1 line-clamp-2 text-sm text-slate-400">
            {item.description || 'No description provided.'}
          </p>
        </div>
        <ItemStatusBadge completed={item.completed} />
      </div>
    </button>
  )
}
