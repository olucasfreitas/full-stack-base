import type { Item, ItemDraft } from './types'

export const emptyItemDraft: ItemDraft = {
  title: '',
  description: '',
  completed: false,
}

export function toItemDraft(item: Item): ItemDraft {
  return {
    title: item.title,
    description: item.description ?? '',
    completed: item.completed,
  }
}
