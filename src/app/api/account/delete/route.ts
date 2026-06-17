import { createClient, createServiceClient } from "@/lib/supabase/server";
import { checkGeneralRateLimit } from "@/lib/rate-limit";
import { NextResponse } from "next/server";

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const service = await createServiceClient();

  // 3 attempts per day — irreversible action, hard cap to prevent abuse
  const rl = await checkGeneralRateLimit(service, `account-delete:${user.id}`, 1440, 3);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Demasiados intentos. Por favor, contacta con soporte." }, { status: 429 });
  }

  // Borrar datos del negocio (review_requests caerán por FK cascade)
  await service.from("businesses").delete().eq("user_id", user.id);

  // Borrar el usuario de auth
  const { error } = await service.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: "Error al eliminar la cuenta" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
