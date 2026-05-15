import { useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

import { requestJson } from '@lib/http/client'

type HealthResponse = {
  service: string
  status: string
}

function HomePage() {
  const [result, setResult] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function checkHealth() {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await requestJson<HealthResponse>('health')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={checkHealth}
        disabled={loading}
        className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-cyan-900 disabled:text-slate-300"
      >
        {loading ? 'Checking...' : 'Check API Health'}
      </button>

      {result ? (
        <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {result.service}: {result.status}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
})
