import { useState } from 'react'

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Outlet, useNavigate, useParams } from '@tanstack/react-router'

import { useToast } from '@app/use-toast'
import { ItemCollectionPanel } from '@components/organisms/items/item-collection-panel'
import { ItemCreatePanel } from '@components/organisms/items/item-create-panel'
import { ItemsPageTemplate } from '@components/templates/items/items-page-template'
import { createItem } from '@entities/item/api'
import { emptyItemDraft } from '@entities/item/draft'
import {
  itemDetailQueryOptions,
  itemsListQueryKey,
  itemsListQueryOptions,
} from '@entities/item/queries'
import type { ItemDraft } from '@entities/item/types'
import { getErrorMessage } from '@shared/api/get-error-message'

function getSelectedItemId(itemId: string | undefined) {
  const parsedId = Number(itemId)

  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null
}

export function ItemsLayoutPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { itemId } = useParams({ strict: false })
  const [createDraft, setCreateDraft] = useState<ItemDraft>(emptyItemDraft)

  const itemsQuery = useSuspenseQuery(itemsListQueryOptions())

  const createMutation = useMutation({
    mutationFn: createItem,
    onSuccess: async (createdItem) => {
      setCreateDraft(emptyItemDraft)

      await queryClient.invalidateQueries({
        queryKey: itemsListQueryKey,
      })
      await queryClient.ensureQueryData(
        itemDetailQueryOptions(String(createdItem.id)),
      )
      await navigate({
        to: '/items/$itemId',
        params: { itemId: String(createdItem.id) },
      })

      showToast({
        message: `Created item #${createdItem.id}.`,
      })
    },
  })

  async function handleRefresh() {
    await itemsQuery.refetch().catch(() => undefined)
  }

  async function handleCreateItem() {
    await createMutation.mutateAsync(createDraft)
  }

  async function handleSelectItem(nextItemId: number) {
    await navigate({
      to: '/items/$itemId',
      params: { itemId: String(nextItemId) },
    })
  }

  const errorMessage = createMutation.error
    ? getErrorMessage(createMutation.error)
    : itemsQuery.error
      ? getErrorMessage(itemsQuery.error)
      : null

  return (
    <ItemsPageTemplate
      createPanel={
        <ItemCreatePanel
          values={createDraft}
          busy={createMutation.isPending}
          onChange={setCreateDraft}
          onSubmit={() => {
            void handleCreateItem()
          }}
          onReset={() => {
            setCreateDraft(emptyItemDraft)
          }}
        />
      }
      collectionPanel={
        <ItemCollectionPanel
          items={itemsQuery.data}
          selectedItemId={getSelectedItemId(itemId)}
          isLoading={itemsQuery.isFetching && itemsQuery.isPending}
          onSelect={(nextItemId) => {
            void handleSelectItem(nextItemId)
          }}
        />
      }
      detailPanel={<Outlet />}
      isRefreshing={itemsQuery.isFetching}
      errorMessage={errorMessage}
      onRefresh={() => {
        void handleRefresh()
      }}
    />
  )
}
