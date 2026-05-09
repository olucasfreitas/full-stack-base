import type { Item } from '../../../entities/item/types'
import { ItemListCard } from '../../molecules/items/item-list-card'

type ItemCollectionPanelProps = {
  items: Item[]
  selectedItemId: number | null
  isLoading: boolean
  onSelect: (id: number) => void
}

export function ItemCollectionPanel({
  items,
  selectedItemId,
  isLoading,
  onSelect,
}: ItemCollectionPanelProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">Collection</h3>
        <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300">
          {items.length} item{items.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-700 px-4 py-6 text-sm leading-6 text-slate-400">
            The database is currently empty. Create your first record with the POST
            form to verify the full stack.
          </p>
        ) : (
          items.map((item) => (
            <ItemListCard
              key={item.id}
              item={item}
              selected={item.id === selectedItemId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </section>
  )
}
