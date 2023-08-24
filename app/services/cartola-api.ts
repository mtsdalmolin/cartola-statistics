export const CARTOLA_API = 'https://api.cartola.globo.com/'

const REVALIDATION_TIME_IN_SECONDS = 5 * 60

export function request(endpoint: string) {
  return fetch(`${CARTOLA_API}${endpoint}`, {
    next: {
      revalidate: REVALIDATION_TIME_IN_SECONDS
    }
  }).then(res => res.json())
}