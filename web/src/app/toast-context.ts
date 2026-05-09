import { createContext } from 'react'

export type ToastTone = 'success' | 'error'

export type ShowToastInput = {
  message: string
  tone?: ToastTone
}

export type ToastContextValue = {
  showToast: (input: ShowToastInput) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
