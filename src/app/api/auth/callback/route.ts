import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && user) {
      const { data: existing } = await supabase
        .from("businesses")
        .select("id, name")
        .eq("user_id", user.id)
        .single();
      if (!existing) {
        await supabase.from("businesses").insert({ user_id: user.id, name: "" });
      }
      // New users (no business name yet) go through onboarding wizard
      const isNewUser = !existing || !existing.name;
      const defaultPath = isNewUser ? "/onboarding" : "/dashboard";
      // Only allow relative paths to prevent open redirect attacks
      const safePath = !isNewUser && next.startsWith("/") && !next.startsWith("//") ? next : defaultPath;
      return NextResponse.redirect(`${origin}${safePath}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
