import { NextResponse } from 'next/server'

export const config = {
  matcher: '/'
}

export function middleware() {
  return NextResponse.redirect(new URL(`${process.env.NEXT_API_BASE_URL}/mercado`))
}
