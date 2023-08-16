export const CARTOLA_API = 'https://api.cartola.globo.com/'

export function request(endpoint: string) {
  return fetch(`${CARTOLA_API}${endpoint}`)
}