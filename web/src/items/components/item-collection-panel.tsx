import { ItemListCard } from '@items/components/item-list-card'
import type { Item } from '@items/types'

type ItemCollectionPanelProps = {
  items: Item[]
  selectedItemId: number | null
  isLoading: boolean
  busyItemId?: number | null
  onSelect: (id: number) => void
  onToggleCompletion: (item: Item) => void
  onDelete: (item: Item) => void
}

export function ItemCollectionPanel({
  items,
  selectedItemId,
  isLoading,
  busyItemId = null,
  onSelect,
  onToggleCompletion,
  onDelete,
}: ItemCollectionPanelProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">Task list</h3>
        <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300">
          {items.length} task{items.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading tasks...</p>
        ) : items.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-700 px-4 py-6 text-sm leading-6 text-slate-400">
            No tasks yet. Add one above to get started.
          </p>
        ) : (
          items.map((item) => (
            <ItemListCard
              key={item.id}
              item={item}
              selected={item.id === selectedItemId}
              busy={busyItemId === item.id}
              onSelect={onSelect}
              onToggleCompletion={onToggleCompletion}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  )
}
