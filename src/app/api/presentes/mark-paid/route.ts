import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Inicializar cliente com Service Role para ter permissão de escrita irrestrita
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { presente_id, convidado_id, valor, mensagem } = await req.json();

    if (!presente_id || !convidado_id || !valor) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // 1. Registrar a contribuição
    const { error: contribError } = await supabaseAdmin.from("contribuicoes").insert({
      presente_id,
      convidado_id,
      valor,
      mensagem,
      status_pagamento: "pago", // Assumindo pago via Pix manual
    });

    if (contribError) throw contribError;

    // 2. Atualizar o presente (arrecadação e disponibilidade)
    // Primeiro buscamos o presente atual
    const { data: presente, error: fetchError } = await supabaseAdmin
      .from("presentes")
      .select("*")
      .eq("id", presente_id)
      .single();

    if (fetchError || !presente) throw fetchError || new Error("Presente não encontrado");

    const novoValorArrecadado = (presente.valor_arrecadado || 0) + valor;
    
    // Se for tipo 'completo', marca como indisponível
    // Se for 'cota', só marca indisponível se atingir o valor total (opcional, mas geralmente cotas ficam abertas)
    const indisponivel = presente.tipo === "completo";

    const { error: updateError } = await supabaseAdmin
      .from("presentes")
      .update({
        valor_arrecadado: novoValorArrecadado,
        disponivel: indisponivel ? false : true,
      })
      .eq("id", presente_id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro na API mark-paid:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
