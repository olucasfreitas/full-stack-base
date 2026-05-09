import { createFileRoute } from '@tanstack/react-router'

import { ItemsListPage } from '../../pages/items/items-list-page'

export const Route = createFileRoute('/items/')({
  component: ItemsListPage,
})
