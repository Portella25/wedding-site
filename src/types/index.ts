export interface Presente {
  id: string;
  titulo: string;
  descricao: string | null;
  preco: number;
  imagem_url: string | null;
  categoria: string | null;
  tipo: "completo" | "cota";
  valor_arrecadado: number;
  disponivel: boolean;
}

export interface Contribuicao {
  id: string;
  presente_id: string;
  convidado_id: string;
  valor: number;
  mensagem: string | null;
  status_pagamento: "pendente" | "pago";
  created_at: string;
}
