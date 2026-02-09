const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Erro: Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontradas.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function reset() {
  console.log("🧹 Iniciando limpeza de dados de presentes...");

  // 1. Apagar todas as contribuições
  console.log("🗑️  Apagando contribuições...");
  const { error: errorContribuicoes } = await supabase
    .from('contribuicoes')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta tudo que não for null (tudo)

  if (errorContribuicoes) {
    console.error("❌ Erro ao apagar contribuições:", errorContribuicoes.message);
  } else {
    console.log("✅ Contribuições apagadas!");
  }

  // 2. Resetar valores arrecadados e disponibilidade dos presentes
  console.log("🔄 Resetando status dos presentes...");
  const { error: errorPresentes } = await supabase
    .from('presentes')
    .update({ 
      valor_arrecadado: 0,
      disponivel: true 
    })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Atualiza todos

  if (errorPresentes) {
    console.error("❌ Erro ao resetar presentes:", errorPresentes.message);
  } else {
    console.log("✅ Presentes resetados!");
  }

  console.log("✨ Limpeza concluída com sucesso!");
}

reset();
