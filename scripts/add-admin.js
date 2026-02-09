const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Erro: Variáveis de ambiente não encontradas.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const email = process.argv[2];

if (!email) {
  console.error("Por favor, forneça um email. Exemplo: node scripts/add-admin.js seu@email.com");
  process.exit(1);
}

async function addAdmin() {
  console.log(`🔒 Adicionando ${email} à whitelist de admins...`);

  // Verificar se já existe
  const { data: existing } = await supabase
    .from('admin_whitelist')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    console.log("⚠️ Este email já está na whitelist.");
    return;
  }

  const { error } = await supabase
    .from('admin_whitelist')
    .insert({ email });

  if (error) {
    console.error("❌ Erro ao adicionar:", error.message);
  } else {
    console.log("✅ Email adicionado com sucesso! Agora você pode fazer login no painel.");
  }
}

addAdmin();
