# Limia Workspace

Monorepo com o portfolio, a documentação do Limia e os pacotes compartilhados do design system.

- `apps/portfolio`: site, dashboard administrativo e API do chat/newsletter.
- `apps/design-system-docs`: documentação do design system.
- `packages/limia-design-system` e `packages/limia-tokens`: componentes e tokens compartilhados.

## Desenvolvimento local

```bash
npm ci
npm run dev:portfolio
```

O Vite encaminha `/api` para `PORTFOLIO_API_PROXY_TARGET`, cujo padrão local é `http://127.0.0.1:3010`. Execute a API também com `NODE_ENV=development`; nesse modo ela usa a porta `3010` por padrão. Configure PostgreSQL local e as variáveis descritas em [apps/portfolio/server/README.md](apps/portfolio/server/README.md).

```bash
npm run build --workspace @limia/portfolio
npm run test --prefix apps/portfolio/server --workspaces=false
```

## Portfolio no servidor

O portfolio é servido pelo mesmo processo Node: ele entrega o build do site e as rotas `/api`, com PostgreSQL como banco. O container se conecta à rede Docker privada `postgres-apps`; a porta publicada fica limitada ao próprio servidor. As instruções de configuração, backup, restauração e publicação estão em [deploy/portfolio/README.md](deploy/portfolio/README.md).

O ambiente de produção usa uma origem HTTPS, um papel PostgreSQL de aplicação com permissões DML restritas e um papel separado para aplicar migrações. Segredos ficam em arquivos protegidos no servidor e não entram no build do site. Após a migração, administradores fazem login novamente para criar uma sessão local.

## Documentação do design system

`apps/design-system-docs` continua como aplicação estática independente. Seu deploy e domínio próprios não fazem parte do serviço de API do portfolio.

## Variáveis de ambiente

O navegador recebe apenas `VITE_POSTHOG_KEY` e `VITE_POSTHOG_HOST`, quando analytics estiver configurado. Chaves de banco, OpenAI, Telegram e integrações ficam somente no ambiente do servidor. Use [deploy/portfolio/env.example](deploy/portfolio/env.example) como referência e nunca versione valores preenchidos.
