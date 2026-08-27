import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => req.cookies.getAll() } }
  )
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user && (req.nextUrl.pathname.startsWith('/list') || req.nextUrl.pathname.startsWith('/create'))) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return NextResponse.next()
}

export const config = { matcher: ['/list/:path*', '/create/:path*', '/login'] }