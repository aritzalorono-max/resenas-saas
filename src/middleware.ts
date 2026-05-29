import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

type CookieToSet = { name: string; value: string; options?: object };

const DASHBOARD_SEGMENTS = [
  "/dashboard", "/clientes", "/resenas", "/configuracion",
  "/cuenta", "/cartel", "/incentivos", "/admin", "/informes",
  "/facturacion", "/onboarding",
];
const AUTH_SEGMENTS = ["/login", "/register"];

function stripLocale(pathname: string): string {
  for (const locale of routing.locales) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(locale.length + 1) || "/";
    }
  }
  return pathname;
}

export async function middleware(request: NextRequest) {
  const bare = stripLocale(request.nextUrl.pathname);

  const isDashboard = DASHBOARD_SEGMENTS.some(
    (s) => bare === s || bare.startsWith(s + "/")
  );
  const isAuth = AUTH_SEGMENTS.some(
    (s) => bare === s || bare.startsWith(s + "/")
  );

  // Public pages — only run intl middleware
  if (!isDashboard && !isAuth) {
    return intlMiddleware(request);
  }

  // Auth-sensitive pages — run Supabase session check first
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as never)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();

  if (!user && isDashboard) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuth) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Let intl middleware set locale cookie/headers, then merge auth cookies
  const intlResponse = intlMiddleware(request);
  const finalResponse = intlResponse ?? supabaseResponse;

  // Copy Supabase auth cookies into the intl response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    finalResponse.cookies.set(cookie.name, cookie.value);
  });

  return finalResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
