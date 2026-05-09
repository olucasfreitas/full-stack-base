import ky from 'ky'

const apiBaseUrl = (() => {
  const value = import.meta.env.VITE_API_BASE_URL ?? '/api/'
  return value.endsWith('/') ? value : `${value}/`
})()

export const apiClient = ky.create({
  baseUrl: apiBaseUrl,
  retry: 0,
  timeout: 10_000,
})
