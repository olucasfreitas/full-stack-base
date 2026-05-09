import { ItemDetailPanel } from '../../components/organisms/items/item-detail-panel'
import { emptyItemDraft } from '../../entities/item/draft'

function noop() {}

function noopDraftChange() {}

export function ItemsListPage() {
  return (
    <ItemDetailPanel
      item={null}
      values={emptyItemDraft}
      busy={false}
      isLoading={false}
      onChange={noopDraftChange}
      onSubmit={noop}
      onReset={noop}
      onToggleCompletion={noop}
      onDelete={noop}
    />
  )
}
