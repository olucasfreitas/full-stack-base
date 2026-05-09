import { useEffect, useMemo, useState } from 'react'

import {
  createItem,
  getErrorMessage,
  getItem,
  listItems,
  patchItem,
  removeItem,
  replaceItem,
} from '../api'
import type { Item, ItemDraft } from '../types'
import { ItemForm } from './item-form'

const emptyDraft: ItemDraft = {
  title: '',
  description: '',
  completed: false,
}

function toDraft(item: Item): ItemDraft {
  return {
    title: item.title,
    description: item.description ?? '',
    completed: item.completed,
  }
}

export function ItemsDashboard() {
  const [items, setItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [createDraft, setCreateDraft] = useState<ItemDraft>(emptyDraft)
  const [editDraft, setEditDraft] = useState<ItemDraft>(emptyDraft)
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [isLoadingItem, setIsLoadingItem] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  async function refreshItems() {
    setIsLoadingList(true)
    setErrorMessage(null)

    try {
      const nextItems = await listItems()
      setItems(nextItems)

      if (selectedItem && !nextItems.some((item) => item.id === selectedItem.id)) {
        setSelectedItem(null)
        setEditDraft(emptyDraft)
      }
    } catch (error) {
      setErrorMessage(await getErrorMessage(error))
    } finally {
      setIsLoadingList(false)
    }
  }

  async function loadItem(id: number) {
    setIsLoadingItem(true)
    setErrorMessage(null)

    try {
      const item = await getItem(id)
      setSelectedItem(item)
      setEditDraft(toDraft(item))
    } catch (error) {
      setErrorMessage(await getErrorMessage(error))
    } finally {
      setIsLoadingItem(false)
    }
  }

  useEffect(() => {
    let isCancelled = false

    async function loadInitialItems() {
      try {
        const nextItems = await listItems()

        if (!isCancelled) {
          setItems(nextItems)
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(await getErrorMessage(error))
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingList(false)
        }
      }
    }

    void loadInitialItems()

    return () => {
      isCancelled = true
    }
  }, [])

  async function handleCreate() {
    setIsSubmitting(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      const created = await createItem(createDraft)
      setCreateDraft(emptyDraft)
      setStatusMessage(`Created item #${created.id}.`)
      await refreshItems()
      await loadItem(created.id)
    } catch (error) {
      setErrorMessage(await getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleReplace() {
    if (!selectedItem) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      const updated = await replaceItem(selectedItem.id, editDraft)
      setStatusMessage(`Replaced item #${updated.id} with PUT.`)
      await refreshItems()
      await loadItem(updated.id)
    } catch (error) {
      setErrorMessage(await getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleTogglePatch() {
    if (!selectedItem) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      const updated = await patchItem(selectedItem.id, {
        completed: !selectedItem.completed,
      })

      setStatusMessage(
        updated.completed
          ? `Patched item #${updated.id} to completed.`
          : `Patched item #${updated.id} to pending.`,
      )
      await refreshItems()
      await loadItem(updated.id)
    } catch (error) {
      setErrorMessage(await getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!selectedItem) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      await removeItem(selectedItem.id)
      setStatusMessage(`Deleted item #${selectedItem.id}.`)
      setSelectedItem(null)
      setEditDraft(emptyDraft)
      await refreshItems()
    } catch (error) {
      setErrorMessage(await getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedSummary = useMemo(() => {
    if (!selectedItem) {
      return 'Choose an item to load the dedicated GET endpoint and enable the PUT, PATCH, and DELETE actions.'
    }

    return `Selected item #${selectedItem.id} was last updated at ${new Date(
      selectedItem.updatedAt,
    ).toLocaleString()}.`
  }, [selectedItem])

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
      <article className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/20">
        <ItemForm
          idPrefix="create-item"
          title="Create an item"
          description="This form issues a POST request to the API and immediately reloads both the collection and the selected detail view."
          submitLabel="Create with POST"
          values={createDraft}
          busy={isSubmitting}
          onChange={setCreateDraft}
          onSubmit={handleCreate}
          onReset={() => setCreateDraft(emptyDraft)}
        />

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
          <p className="font-medium text-white">Frontend API strategy</p>
          <p className="mt-2 leading-6">
            The browser talks to a relative <code className="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-300">/api</code> path through a shared <code className="rounded bg-slate-800 px-1.5 py-0.5 text-cyan-300">ky</code> client, and Vite proxies that traffic to Nest during development.
          </p>
        </div>
      </article>

      <article className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Item dashboard</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              The collection view uses <strong>GET /api/items</strong>, selecting a row calls
              <strong> GET /api/items/:id</strong>, and the detail panel exposes the remaining
              mutation routes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void refreshItems()}
            disabled={isLoadingList}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:text-white disabled:cursor-not-allowed disabled:text-slate-500"
          >
            {isLoadingList ? 'Refreshing...' : 'Refresh list'}
          </button>
        </div>

        {errorMessage ? (
          <div className="mt-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {errorMessage}
          </div>
        ) : null}

        {statusMessage ? (
          <div className="mt-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {statusMessage}
          </div>
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-white">Collection</h3>
              <span className="rounded-full border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300">
                {items.length} item{items.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="space-y-3">
              {isLoadingList ? (
                <p className="text-sm text-slate-400">Loading items...</p>
              ) : items.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-slate-700 px-4 py-6 text-sm leading-6 text-slate-400">
                  The database is currently empty. Create your first record with the POST
                  form to verify the full stack.
                </p>
              ) : (
                items.map((item) => {
                  const isSelected = item.id === selectedItem?.id

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => void loadItem(item.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                        isSelected
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
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            item.completed
                              ? 'bg-emerald-500/15 text-emerald-200'
                              : 'bg-amber-500/15 text-amber-200'
                          }`}
                        >
                          {item.completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="mb-4 space-y-2">
              <h3 className="text-lg font-semibold text-white">Selected item</h3>
              <p className="text-sm leading-6 text-slate-400">{selectedSummary}</p>
            </div>

            {isLoadingItem ? (
              <p className="text-sm text-slate-400">Loading item details...</p>
            ) : selectedItem ? (
              <div className="space-y-6">
                <div className="grid gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">ID</p>
                    <p className="mt-2 text-sm font-medium text-white">#{selectedItem.id}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">State</p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {selectedItem.completed ? 'Completed' : 'Pending'}
                    </p>
                  </div>
                </div>

                <ItemForm
                  idPrefix="edit-item"
                  title="Replace the selected item"
                  description="Submitting this form sends a full PUT payload with the current title, description, and completed state."
                  submitLabel="Replace with PUT"
                  values={editDraft}
                  busy={isSubmitting}
                  onChange={setEditDraft}
                  onSubmit={handleReplace}
                  onReset={() => setEditDraft(selectedItem ? toDraft(selectedItem) : emptyDraft)}
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void handleTogglePatch()}
                    disabled={isSubmitting}
                    className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400 hover:bg-cyan-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {selectedItem.completed ? 'Mark pending with PATCH' : 'Mark completed with PATCH'}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete()}
                    disabled={isSubmitting}
                    className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:border-rose-400 hover:bg-rose-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete with DELETE
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-700 px-4 py-8 text-sm leading-6 text-slate-400">
                Select an item from the collection to load its dedicated detail route.
              </div>
            )}
          </div>
        </div>
      </article>
    </section>
  )
}
