import { Outlet } from '@tanstack/react-router'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-6 px-6 py-10">
        <h1 className="text-4xl font-semibold tracking-tight text-white">
          Full Stack Base
        </h1>
        <p className="text-sm leading-7 text-slate-400">
          React + NestJS + MySQL + Drizzle
        </p>

        <Outlet />
      </main>
    </div>
  )
}
