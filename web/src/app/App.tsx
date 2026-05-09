import { Outlet } from '@tanstack/react-router'

import { ToastProvider } from './toast-provider'

export default function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-10 lg:px-8">
          <header className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Full-Stack Base
            </p>
            <div className="space-y-3">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                React + NestJS starter wired end to end.
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                This workspace ships with a Vite frontend, a Nest API, Drizzle-backed
                MySQL persistence, and a CRUD example that proves the full connection
                between both apps.
              </p>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </ToastProvider>
  )
}
