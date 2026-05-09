import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext } from '@tanstack/react-router'

import App from '../app/App'

function RootNotFound() {
  return (
    <section className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/60 p-6 text-sm leading-6 text-slate-300">
      <h2 className="text-xl font-semibold text-white">Route not found</h2>
      <p className="mt-3">
        The requested page does not exist in this starter workspace.
      </p>
    </section>
  )
}

function RootError({ error }: { error: Error }) {
  return (
    <section className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm leading-6 text-rose-100">
      <h2 className="text-xl font-semibold text-white">Something went wrong</h2>
      <p className="mt-3">{error.message}</p>
    </section>
  )
}

function RootPending() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 text-sm leading-6 text-slate-300">
      Loading route...
    </section>
  )
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: App,
  errorComponent: RootError,
  pendingComponent: RootPending,
  notFoundComponent: RootNotFound,
})
