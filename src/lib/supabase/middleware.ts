// @ts-nocheck
import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (toSet: Parameters<CookieMethodsServer['setAll']>[0]) => {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          toSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAuthRoute     = pathname.startsWith('/login') || pathname.startsWith('/registro')
  const isApiRoute      = pathname.startsWith('/api')
  const isOnboarding    = pathname.startsWith('/onboarding')
  const isUnirse        = pathname.startsWith('/unirse')
  const isPublicRoute   = isAuthRoute || isApiRoute || isUnirse

  if (!user && !isPublicRoute && !isOnboarding) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users with no active team to onboarding
  // (only for dashboard routes, not onboarding/unirse itself)
  if (user && !isPublicRoute && !isOnboarding && !isUnirse) {
    const { data: profile } = await supabase
      .from('guardias_profiles')
      .select('active_team_id')
      .eq('id', user.id)
      .single()

    if (profile && !profile.active_team_id) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
