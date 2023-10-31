'use server'

import { track } from '@vercel/analytics/server'

export async function registerTrophyEvent(
  trophyName: string,
  data: Record<string, string | number | null>
) {
  await track(`trophy:${trophyName}`, data)
}
