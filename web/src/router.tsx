import { QueryClient } from '@tanstack/react-query'
import {
  createRouter,
  type RouterHistory,
} from '@tanstack/react-router'

import { routeTree } from './routeTree.gen'

type CreateAppRouterOptions = {
  queryClient: QueryClient
  history?: RouterHistory
}

export function createAppRouter({
  queryClient,
  history,
}: CreateAppRouterOptions) {
  return createRouter({
    routeTree,
    history,
    context: { queryClient },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
  })
}

export const queryClient = new QueryClient()

export const router = createAppRouter({ queryClient })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
