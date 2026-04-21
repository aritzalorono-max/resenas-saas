import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const service = await createServiceClient();

  // Borrar datos del negocio (review_requests caerán por FK cascade)
  await service.from("businesses").delete().eq("user_id", user.id);

  // Borrar el usuario de auth
  const { error } = await service.auth.admin.deleteUser(user.id);
  if (error) {
    return NextResponse.json({ error: "Error al eliminar la cuenta" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
