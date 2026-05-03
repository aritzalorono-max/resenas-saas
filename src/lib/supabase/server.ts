import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Shared cookie adapter for both anon and service-role clients.
// The setAll try/catch is intentional: in Server Components cookies can't be
// set at render time — they're committed by the middleware on the way out.
function buildCookieAdapter(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  return {
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
      try {
        cookiesToSet.forEach(({ name, value, options }) =>
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          cookieStore.set(name, value, options as any)
        );
      } catch {
        // Server Component — cookies will be set by middleware
      }
    },
  };
}

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: buildCookieAdapter(cookieStore) }
  );
}

export async function createServiceClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: buildCookieAdapter(cookieStore) }
  );
}
