import type { Item } from '../../../entities/item/types'
import { ItemStatusBadge } from '../../atoms/items/item-status-badge'

type ItemMetaSummaryProps = {
  item: Item
}

export function ItemMetaSummary({ item }: ItemMetaSummaryProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:grid-cols-3">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">ID</p>
        <p className="mt-2 text-sm font-medium text-white">#{item.id}</p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">State</p>
        <div className="mt-2">
          <ItemStatusBadge completed={item.completed} />
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Updated</p>
        <p className="mt-2 text-sm font-medium text-white">
          {new Date(item.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  )
}
