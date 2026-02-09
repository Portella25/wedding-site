# Letícia & Adriano - Site de Casamento

Este é o projeto do site de casamento, desenvolvido com **Next.js 14**, **Tailwind CSS**, **Supabase** e **Docker**.

## 🚀 Como Iniciar

### 1. Configuração do Ambiente

1. Copiar o arquivo `.env.local` e preencher com as credenciais:
   ```bash
   cp .env.local .env
   ```
   **Variáveis Necessárias:**
   - `NEXT_PUBLIC_SUPABASE_URL`: URL do seu projeto Supabase.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave pública (anon).
   - `SUPABASE_SERVICE_ROLE_KEY`: Chave secreta (service_role) para operações administrativas.
   - `ADMIN_PASSWORD`: Senha para acessar o painel `/admin`.
   - `JWT_SECRET`: Uma string aleatória para assinar o token de admin.
   - `R2_*`: Credenciais do Cloudflare R2 (opcional para upload de fotos, caso contrário simulará upload).

### 2. Banco de Dados (Supabase)

1. No painel do Supabase, ir em **SQL Editor**.
2. Executar o conteúdo de `supabase/schema.sql` para criar as tabelas.
3. Executar o conteúdo de `supabase/seed.sql` para popular com dados iniciais (presentes e convidados de teste).

### 3. Rodando o Projeto

#### Via Docker (Recomendado)
```bash
docker-compose up --build
```
Acesse: `http://localhost:3000`

#### Via NPM (Local)
```bash
npm install
npm run dev
```

## 🔐 Acessos

### Convidado
Usar um dos tokens gerados no seed para entrar na home:
- Token: `VIP2026`
- Token: `SILVA26`

### Painel Administrativo
Acesse `/admin/login`
- Senha: A que foi definida em `ADMIN_PASSWORD`

## 🛠 Funcionalidades

- [x] **Home**: Contagem regressiva, Vídeo Hero, Navegação.
- [x] **RSVP**: Confirmação de presença com número de acompanhantes.
- [x] **Lista de Presentes**: Catálogo, Cotas e Pagamento Pix (QR Code).
- [x] **O Grande Dia**: Convite interativo (Envelope 3D e Livro).
- [x] **Nossa História**: Timeline animada do casal.
- [x] **Memórias**: Galeria de fotos com upload e compressão.
- [x] **Admin**: Dashboard, Moderação de Fotos, Login Seguro.

## 📦 Deploy

Este projeto está pronto para deploy na **Vercel**.
1. Importar o repositório na Vercel.
2. Configure as Variáveis de Ambiente (Environment Variables) com os mesmos valores do `.env`.
3. Deploy!

---
Feito para o casamento do ano!
