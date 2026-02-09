# Checklist de Deploy e Configuração Manual 🚀

Seu site está pronto em termos de código! Aqui está o passo-a-passo do que você precisa configurar externamente para colocar tudo no ar.

## 1. Banco de Dados (Supabase) 🗄️

O site usa Supabase para autenticação de convidados, lista de presentes e registro de fotos.

1.  Crie uma conta em [supabase.com](https://supabase.com/).
2.  Crie um novo projeto.
3.  Vá em **Project Settings > API** e copie:
    *   `Project URL` (será `NEXT_PUBLIC_SUPABASE_URL`)
    *   `anon public` key (será `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
    *   `service_role` key (será `SUPABASE_SERVICE_ROLE_KEY`) - **Cuidado! Esta chave dá acesso total.**
4.  Vá em **SQL Editor** no painel do Supabase.
5.  Abra o arquivo `supabase/schema.sql` deste projeto, copie o conteúdo e cole no SQL Editor. Execute para criar as tabelas.
6.  (Opcional) Abra `supabase/seed.sql`, copie e execute para adicionar dados de teste (presentes e convidados).

## 2. Armazenamento de Fotos (Cloudflare R2) ☁️

Para a galeria de fotos (`/memorias`), o site usa Cloudflare R2 (compatível com S3).

1.  Crie uma conta na [Cloudflare](https://www.cloudflare.com/).
2.  No painel, vá em **R2** e crie um bucket (ex: `wedding-photos`).
3.  Vá em **Manage R2 API Tokens** e crie um token com permissão de **Edit** (Leitura e Escrita).
4.  Copie:
    *   `Account ID`
    *   `Access Key ID`
    *   `Secret Access Key`
5.  Configure o CORS no seu bucket para permitir uploads do seu site (em Settings do bucket).
    *   Permitir Origins: `*` (ou o domínio do seu site)
    *   Permitir Methods: `PUT`, `GET`
    *   Permitir Headers: `*`

*Se não configurar o R2, o upload de fotos entrará em modo "Mock" (simulação) e não salvará arquivos reais.*

## 3. Variáveis de Ambiente (.env) 🔑

No seu provedor de hospedagem (Vercel, Railway, etc.) ou no arquivo `.env` local, configure:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# Cloudflare R2 (Fotos)
R2_ACCOUNT_ID=seu_account_id
R2_ACCESS_KEY_ID=seu_access_key_id
R2_SECRET_ACCESS_KEY=seu_secret_access_key
R2_BUCKET_NAME=nome_do_seu_bucket
NEXT_PUBLIC_R2_PUBLIC_URL=url_publica_do_bucket (ou deixe vazio para testar)

# Admin
ADMIN_PASSWORD=sua_senha_secreta_para_admin
JWT_SECRET=digite_uma_string_aleatoria_longa_aqui
```

## 4. Deploy (Vercel) ▲

A forma mais fácil de colocar no ar.

1.  Crie uma conta na [Vercel](https://vercel.com/).
2.  Instale a Vercel CLI ou conecte seu GitHub.
3.  Importe este repositório.
4.  Nas configurações do projeto na Vercel, adicione as **Environment Variables** acima.
5.  Clique em **Deploy**.

## 5. Testes ✅

Para garantir que tudo está funcionando antes do deploy:

```bash
npm test
```

Isso rodará os testes unitários criados para validar a lógica principal (Login, Timer, Componentes).

---
**Boa sorte com o casamento!** 💍
