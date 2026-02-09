-- Atualização para o Painel Admin v2

-- 1. Adicionar campo de mensagem personalizada para convidados
alter table public.convidados 
add column if not exists mensagem_personalizada text;

-- 2. Tabela de Whitelist de Admins (para segurança extra além do login)
create table if not exists public.admin_whitelist (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.admin_whitelist enable row level security;

-- Política: Apenas leitura pública (para o middleware checar) ou restrita?
-- Vamos permitir que o service_role gerencie, e leitura autenticada.
create policy "Leitura de whitelist para autenticados" 
on public.admin_whitelist for select 
to authenticated 
using (true);

-- 3. Atualizar políticas das outras tabelas para permitir acesso total aos admins
-- (Supabase Auth usa a role 'authenticated'. Vamos diferenciar admins de usuários normais via app logic ou claims, 
-- mas como não temos custom claims fáceis aqui, vamos confiar na Whitelist no Middleware e RLS permissiva para 'authenticated' 
-- se o app garantir que apenas admins loguem.
-- PORÉM, convidados não logam via Supabase Auth (usam token na tabela). 
-- Logo, qualquer usuário logado via Supabase Auth (auth.users) É um admin (se desativarmos sign-up público ou usarmos whitelist).

-- Vamos criar uma política que permite CRUD total para usuários autenticados (Admins)
create policy "Admins têm acesso total a convidados" on public.convidados for all to authenticated using (true);
create policy "Admins têm acesso total a presentes" on public.presentes for all to authenticated using (true);
create policy "Admins têm acesso total a contribuicoes" on public.contribuicoes for all to authenticated using (true);
create policy "Admins têm acesso total a fotos" on public.fotos for all to authenticated using (true);
create policy "Admins têm acesso total a configuracoes" on public.configuracoes for all to authenticated using (true);

-- Inserir emails iniciais (substitua pelos reais)
-- insert into public.admin_whitelist (email) values ('seu-email@exemplo.com'), ('leticia@exemplo.com');

create table if not exists public.historia_eventos (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ordem integer default 0,
  ano text not null,
  titulo text not null,
  descricao text,
  imagem_url text
);
alter table public.historia_eventos enable row level security;
create policy "Leitura de historia_eventos para autenticados" on public.historia_eventos for select to authenticated using (true);
create policy "Admins têm acesso total a historia_eventos" on public.historia_eventos for all to authenticated using (true);
