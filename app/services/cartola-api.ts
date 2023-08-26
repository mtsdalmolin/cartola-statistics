import { RequestInit } from "next/dist/server/web/spec-extension/request"

export const CARTOLA_API = 'https://api.cartola.globo.com'

export const ENDPOINTS = {
  MARKET: '/atletas/mercado',
  MATCHES: '/partidas',
}

const REVALIDATION_TIME_IN_SECONDS = 5 * 60

export function request(endpoint: string, options: RequestInit = {}) {
  return fetch(`${CARTOLA_API}${endpoint}`, {
    next: {
      revalidate: options?.next?.revalidate ?? REVALIDATION_TIME_IN_SECONDS,
    },
    ...options
  }).then(res => res.json())
}