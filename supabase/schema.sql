-- Tabela de Convidados
create table public.convidados (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  nome text not null,
  telefone text,
  token text not null unique,
  status_rsvp text default 'pendente' check (status_rsvp in ('pendente', 'confirmado', 'recusado')),
  acompanhantes_max integer default 0,
  acompanhantes_confirmados integer default 0,
  mensagem_rsvp text
);

-- Tabela de Presentes
create table public.presentes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  titulo text not null,
  descricao text,
  preco numeric not null,
  imagem_url text,
  categoria text,
  tipo text default 'completo' check (tipo in ('completo', 'cota')),
  valor_arrecadado numeric default 0,
  disponivel boolean default true
);

-- Tabela de Contribuições (Pagamentos)
create table public.contribuicoes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  presente_id uuid references public.presentes(id),
  convidado_id uuid references public.convidados(id),
  valor numeric not null,
  mensagem text,
  status_pagamento text default 'pendente' check (status_pagamento in ('pendente', 'pago'))
);

-- Tabela de Fotos (Memórias)
create table public.fotos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  convidado_id uuid references public.convidados(id),
  url text not null,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  legenda text
);

-- Tabela de Configurações
create table public.configuracoes (
  chave text primary key,
  valor jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Habilitar RLS (Row Level Security)
alter table public.convidados enable row level security;
alter table public.presentes enable row level security;
alter table public.contribuicoes enable row level security;
alter table public.fotos enable row level security;
alter table public.configuracoes enable row level security;

-- Políticas de Segurança (Exemplos básicos, refinar conforme necessidade)

-- Convidados: leitura pública (ou restrita via função backend)
-- Por enquanto, vamos permitir leitura pública para facilitar o desenvolvimento, 
-- mas idealmente o acesso é feito via server-side com service role.
create policy "Leitura pública de convidados" on public.convidados for select using (true);

-- Presentes: leitura pública
create policy "Leitura pública de presentes" on public.presentes for select using (true);

-- Fotos: leitura apenas de aprovadas
create policy "Leitura pública de fotos aprovadas" on public.fotos for select using (status = 'approved');

-- Configurações: leitura pública
create policy "Leitura pública de configurações" on public.configuracoes for select using (true);
