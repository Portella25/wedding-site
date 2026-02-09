import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Supabase Admin para bypass RLS na escrita se necessário, ou apenas autenticado
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "https://pub-r2.dev"; // Fallback ou Env

export async function POST(req: Request) {
  try {
    const { guestId, key, legenda } = await req.json();

    if (!guestId || !key) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Verificar limite de 3 fotos
    const { count, error: countError } = await supabaseAdmin
      .from("fotos")
      .select("*", { count: "exact", head: true })
      .eq("convidado_id", guestId);

    if (countError) throw countError;

    if ((count || 0) >= 3) {
      return NextResponse.json({ error: "Limite de 3 fotos atingido." }, { status: 403 });
    }

    // Construir URL pública
    const publicUrl = `${R2_PUBLIC_URL}/${key}`;

    const { data, error } = await supabaseAdmin
      .from("fotos")
      .insert({
        convidado_id: guestId,
        url: publicUrl,
        legenda: legenda,
        status: "pending", // Pendente de moderação
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Error registering photo:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
