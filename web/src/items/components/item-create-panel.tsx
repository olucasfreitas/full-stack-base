import { ItemForm } from '@items/components/item-form'
import type { ItemDraft } from '@items/types'
import { Panel } from '@lib/ui/panel'

type ItemCreatePanelProps = {
  values: ItemDraft
  busy: boolean
  onChange: (next: ItemDraft) => void
  onSubmit: () => void
  onReset: () => void
}

export function ItemCreatePanel({
  values,
  busy,
  onChange,
  onSubmit,
  onReset,
}: ItemCreatePanelProps) {
  return (
    <Panel as="article">
      <ItemForm
        idPrefix="create-item"
        title="Add task"
        description="Keep it simple: give the task a title and add a note only if it helps."
        submitLabel="Add task"
        titleLabel="Task title"
        descriptionLabel="Task description"
        showCompletedField={false}
        values={values}
        busy={busy}
        onChange={onChange}
        onSubmit={onSubmit}
        onReset={onReset}
      />
    </Panel>
  )
}
