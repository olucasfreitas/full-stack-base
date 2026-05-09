import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import {
  ToastContext,
  type ShowToastInput,
  type ToastTone,
} from './toast-context'

type Toast = {
  id: number
  message: string
  tone: ToastTone
}

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextToastId = useRef(0)

  const dismissToast = useCallback((toastId: number) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId),
    )
  }, [])

  const showToast = useCallback(
    ({ message, tone = 'success' }: ShowToastInput) => {
      const toastId = nextToastId.current++

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id: toastId,
          message,
          tone,
        },
      ])

      window.setTimeout(() => {
        dismissToast(toastId)
      }, 4_000)
    },
    [dismissToast],
  )

  const value = useMemo(
    () => ({
      showToast,
    }),
    [showToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-50 flex max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${
              toast.tone === 'success'
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-100'
                : 'border-rose-500/40 bg-rose-500/15 text-rose-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <p className="flex-1 leading-6">{toast.message}</p>
              <button
                type="button"
                onClick={() => {
                  dismissToast(toast.id)
                }}
                className="rounded-md px-2 py-1 text-xs font-semibold text-current/80 transition hover:bg-white/10 hover:text-current"
              >
                Close
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
