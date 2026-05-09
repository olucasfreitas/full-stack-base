export type Item = {
  id: number
  title: string
  description: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
}

export type ItemDraft = {
  title: string
  description: string
  completed: boolean
}

export type CreateItemInput = ItemDraft

export type ReplaceItemInput = ItemDraft

export type PatchItemInput = Partial<ItemDraft>
