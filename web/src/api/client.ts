import ky from 'ky'

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '/api').replace(/\/$/, '')

export const apiClient = ky.create({
  prefix: apiBaseUrl,
  retry: 0,
  timeout: 10_000,
})
