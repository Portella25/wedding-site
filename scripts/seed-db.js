const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Erro: Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontradas.");
  console.error("Certifique-se de ter configurado o arquivo .env corretamente.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const presentes = [
  { titulo: 'Jantar Romântico em Paris', descricao: 'Um jantar inesquecível na Torre Eiffel para celebrar nossa lua de mel.', preco: 500.00, imagem_url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop', categoria: 'Lua de Mel', tipo: 'completo', disponivel: true },
  { titulo: 'Passeio de Gôndola em Veneza', descricao: 'Para curtirmos o romantismo dos canais italianos.', preco: 350.00, imagem_url: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2066&auto=format&fit=crop', categoria: 'Lua de Mel', tipo: 'completo', disponivel: true },
  { titulo: 'Cafeteira Nespresso', descricao: 'Para começarmos o dia com energia e amor.', preco: 800.00, imagem_url: 'https://images.unsplash.com/photo-1517701604599-bb29b5dd7359?q=80&w=2070&auto=format&fit=crop', categoria: 'Casa Nova', tipo: 'completo', disponivel: true },
  { titulo: 'Jogo de Panelas Le Creuset', descricao: 'Para preparar nossos jantares especiais.', preco: 2500.00, imagem_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?q=80&w=1974&auto=format&fit=crop', categoria: 'Casa Nova', tipo: 'completo', disponivel: true },
  { titulo: 'Cota para Passagens Aéreas', descricao: 'Ajude-nos a voar para o nosso destino dos sonhos.', preco: 5000.00, imagem_url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop', categoria: 'Lua de Mel', tipo: 'cota', disponivel: true },
  { titulo: 'Spa Day para os Noivos', descricao: 'Um dia de relaxamento após a festa.', preco: 600.00, imagem_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop', categoria: 'Lua de Mel', tipo: 'completo', disponivel: true }
];

const convidados = [
  { nome: 'Convidado VIP', telefone: '11999999999', token: 'VIP2026', acompanhantes_max: 2 },
  { nome: 'Família Silva', telefone: '11988888888', token: 'SILVA26', acompanhantes_max: 4 },
  { nome: 'Amigo Teste', telefone: '11977777777', token: 'TESTE01', acompanhantes_max: 1 }
];

async function seed() {
  console.log("🌱 Iniciando Seed...");

  // Inserir Presentes
  console.log("🎁 Inserindo Presentes...");
  const { error: errorPresentes } = await supabase.from('presentes').insert(presentes);
  if (errorPresentes) {
    console.error("❌ Erro ao inserir presentes:", errorPresentes.message);
  } else {
    console.log("✅ Presentes inseridos com sucesso!");
  }

  // Inserir Convidados
  console.log("👥 Inserindo Convidados...");
  const { error: errorConvidados } = await supabase.from('convidados').insert(convidados);
  if (errorConvidados) {
    console.error("❌ Erro ao inserir convidados:", errorConvidados.message);
  } else {
    console.log("✅ Convidados inseridos com sucesso!");
  }

  console.log("🎉 Seed concluído!");
}

seed();
