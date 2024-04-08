import { NextRequest, NextResponse } from 'next/server'

export const config = {
  matcher: '/mercado'
}

export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/in/mercado', request.url))
}
