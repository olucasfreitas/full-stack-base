type StatusBannerProps = {
  tone: 'error' | 'success'
  message: string
}

export function StatusBanner({ tone, message }: StatusBannerProps) {
  const classes =
    tone === 'error'
      ? 'border-rose-500/40 bg-rose-500/10 text-rose-200'
      : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${classes}`}
    >
      {message}
    </div>
  )
}
