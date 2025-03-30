export async function getJwtToken() {
  return fetch(`${process.env.NEXT_API_BASE_URL}/api/get-token`).then((res) => res.json())
}

export async function getRefreshToken() {
  return fetch(`${process.env.NEXT_API_BASE_URL}/api/get-refresh-token`).then((res) => res.json())
}
