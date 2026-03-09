# Limia Workspace

Monorepo com dois apps e dois pacotes:

- `apps/portfolio`: site principal
- `apps/design-system-docs`: documentação do Limia
- `packages/limia-design-system`: runtime React do design system
- `packages/limia-tokens`: tokens e pipeline de geração

## Desenvolvimento

Instalação:

```bash
npm install
```

Rodar o portfolio:

```bash
npm run dev:portfolio
```

Rodar a documentação do Limia:

```bash
npm run dev:docs
```

Build completo:

```bash
npm run build
```

## Variáveis de ambiente

Portfolio client:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Portfolio serverless function:

- `N8N_WEBHOOK_URL`
- `N8N_WEBHOOK_SECRET`
- `CHAT_ALLOWED_ORIGINS`

Exemplo de `CHAT_ALLOWED_ORIGINS`:

```text
https://elimaj.com.br,https://limia.elimaj.com.br,https://<preview>.vercel.app
```

## Deploy na Vercel

Crie dois projetos separados na Vercel:

1. Portfolio
   - Root Directory: `apps/portfolio`
   - Production Domain: `elimaj.com.br`
   - Config local: [apps/portfolio/vercel.json](C:/Users/dulim/Downloads/EduardoLima-Portfolio/apps/portfolio/vercel.json)

2. Limia Docs
   - Root Directory: `apps/design-system-docs`
   - Production Domain: `limia.elimaj.com.br`
   - Config local: [apps/design-system-docs/vercel.json](C:/Users/dulim/Downloads/EduardoLima-Portfolio/apps/design-system-docs/vercel.json)

Importante:

- a function de chat do portfolio vive em [apps/portfolio/api/chat.js](C:/Users/dulim/Downloads/EduardoLima-Portfolio/apps/portfolio/api/chat.js)
- o docs app é estático e não depende de `/api`
- o root do repositório não deve mais ser usado como projeto Vercel

## Domínio e subdomínio

Na Vercel:

1. Adicione `elimaj.com.br` ao projeto do portfolio.
2. Adicione `limia.elimaj.com.br` ao projeto de docs.
3. Copie os registros DNS sugeridos pela Vercel para o provedor do domínio.

Se o DNS estiver fora da Vercel, normalmente o subdomínio fica como `CNAME` apontando para o alvo informado pela plataforma.

## Acesso do dashboard

O dashboard depende de Supabase Auth e papel administrativo.

- Claims suportadas: `app_metadata.role` com `admin|owner|superadmin`
- Source of truth: tabela `profiles` com `role` e `is_admin`
- Fallback opcional: claim JWT `app_metadata.role`

Antes de produção, aplicar:

- `supabase/rls/interaction_logs.sql`
