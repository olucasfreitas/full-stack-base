import { Outlet } from '@tanstack/react-router'

import { ToastProvider } from './toast-provider'

export default function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-10 lg:px-8">
          <header className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
              Simple task app
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Tasks
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Add tasks, update one field at a time with PATCH, save the full task
              with PUT, and keep the whole flow on one clean screen.
            </p>
          </header>

          <Outlet />
        </main>
      </div>
    </ToastProvider>
  )
}
