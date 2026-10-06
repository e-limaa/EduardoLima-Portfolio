# Plano de migração: Supabase para PostgreSQL próprio

Data: 06/10/2026. Estado atual: corte público concluído; site e API atendidos pelo servidor com PostgreSQL próprio.

Escopo confirmado pelo responsável: eliminar toda dependência de execução do Supabase, aproveitando o PostgreSQL que já existe no servidor. A motivação é evitar as pausas do plano gratuito.

Aplicação confirmada: EduardoLima-Portfolio. Servidor confirmado: `eduardo@192.168.0.101`. O responsável escolheu hospedar site e API no servidor e aceita uma janela de manutenção para a troca; sua duração será medida no ensaio.

## Estado corrente após o corte público

Este bloco substitui as previsões e verificações pendentes das seções abaixo quando elas divergirem.

- A interface chama a API same-origin. O novo backend Node 22 substitui as rotas Supabase de login, autorização administrativa, newsletter e chat; o SDK Supabase e a antiga função Vercel de chat foram removidos do runtime do portfolio.
- A aplicação está em produção na porta privada `127.0.0.1:8011`, com papel DML próprio. O Tunnel encaminha `elimaj.com.br` e `www.elimaj.com.br` para `http://portfolio-production_app_1:3000`; o DNS dos dois hostnames agora aponta ao `n8n-tunnel`, com proxy Cloudflare ativo. HTTPS e as páginas públicas responderam 200.
- O Sanity Studio agora é compilado e servido como serviço estático isolado no servidor. `cms.elimaj.com.br` aponta pelo mesmo Tunnel para `http://portfolio-studio-production:3333`; o painel abre a tela de login e os projetos, textos e imagens continuam no projeto Sanity. Nenhum conteúdo foi editado na validação.
- O backend fornece `/api/projects`, detalhes e navegação e consulta os documentos publicados via API pública do Sanity; a interface usa essa API same-origin. A migração do CMS foi somente do painel, conforme decisão confirmada.
- A inspeção visual após o primeiro corte encontrou tela em branco causada por ciclo entre chunks manuais de React. A divisão manual foi removida, o build de 3.070 módulos foi publicado e uma nova sessão do navegador confirmou a página renderizada sem erros JavaScript; permaneceu apenas um aviso de depreciação do `THREE.Clock`.
- As migrações versionadas foram aplicadas em `portfolio_production`. A exportação final do Supabase foi importada por transação com `--allow-existing`; origem e destino conferiram: 1 usuário, 1 perfil, 19 inscritos, 173 interações e 6 itens de conhecimento. O hash bcrypt foi preservado sem exibição. Sessões anteriores não foram migradas; cada usuário precisa entrar novamente.
- O backup lógico anterior foi restaurado no banco isolado `portfolio_verify`, e todas as cinco contagens coincidiram. Depois da sincronização final, foi gerado novo backup protegido em `/home/eduardo/portfolio/backups/portfolio-production-20261006T025209Z-XW6OxL.dump`; `pg_restore` validou a estrutura, SHA-256 conferiu e dump/manifesto estão com permissão 600.
- Os 15 testes locais passaram; 1 teste de integração dependente de `TEST_DATABASE_URL` foi pulado no ambiente local. No servidor, passaram os 14 testes HTTP/segurança/outbox e o ensaio PostgreSQL de concorrência, sessão, outbox, gravação e restauração. Os builds local e remoto transformaram 3.070 módulos. No corte, `/api/health` respondeu 200 e sessão e painel administrativo sem autenticação responderam 401.
- A credencial n8n de produção lê somente `id`, `name` e `email`; o teste da conexão PostgreSQL foi bem-sucedido. `Gerador de Newsletter IA` está publicado e ativo, consultando a tabela do PostgreSQL. `Email boas vindas - Newsletter` também está publicado e ativo, com Header Auth no webhook `/webhook/novo-inscrito-newsletter`. Nenhum workflow foi executado manualmente e nenhum email foi enviado durante o corte.
- A entrega do outbox continua desligada (`NEWSLETTER_DELIVERY_ENABLED=false`) até concluir deduplicação persistente do ID do evento no consumidor n8n. Cadastros novos são gravados no PostgreSQL, mas a API não envia o email de boas-vindas enquanto esse item estiver pendente.
- A zona Cloudflare mantém os registros não relacionados ao corte, inclusive os registros de email. O Supabase permanece intacto como origem e opção de retorno durante o período de observação; não deve ser apagado nem desativado antes de validar login, operação e backups no destino.

O corte foi aplicado após autorização expressa. A validação funcional do login administrativo com a senha atual, recuperação de acesso, cadastro real de newsletter, persistência do chat e acompanhamento de estabilidade ao longo do período de observação seguem como verificações pós-corte; os smoke tests desta janela não criaram cadastros, conversas ou envios de email.

## O que foi verificado

No inventário inicial foram realizadas leitura do código, consultas de catálogo/contagens no Supabase e inspeção somente de leitura por SSH. Essa descrição é histórica; o corte aplicado está documentado no bloco corrente acima.

### Origem verificada

Projeto Supabase: `Bio - Portfolio`, referência `owklnkzxuitlcikftkew`, correspondente à URL configurada localmente em `apps/portfolio/.env`. A consulta encontrou o projeto ativo e saudável e PostgreSQL 17.6; o tamanho total do banco era 13 MB, incluindo estruturas da plataforma.

| Dados | Contagem exata na consulta |
| --- | ---: |
| `newsletter_subscribers` | 19 |
| `interaction_logs` | 173 |
| `agent_knowledge` | 6 |
| `profiles` | 1 |
| Usuários em `auth.users` | 1 |
| Buckets / objetos no Storage | 0 / 0 |
| Edge Functions no Supabase | 0 |

Há um perfil administrador, um usuário com login por email e senha bcrypt, sem fatores MFA cadastrados e sem papel administrativo em `app_metadata`. Preservar o UUID, o perfil e a senha através da importação segura do hash e da verificação com biblioteca compatível; exigir novo login após a troca. Nenhuma senha ou hash foi exibido no diagnóstico.

As quatro tabelas públicas usam UUID, text, boolean, timestamptz e JSONB. A única FK identificada entre elas e os serviços da plataforma é `profiles.id → auth.users.id`. Há sete índices nas tabelas públicas, incluindo UNIQUE de email na newsletter, cinco políticas RLS e três funções próprias: `handle_new_user`, `set_updated_at` e `is_dashboard_admin`.

O trigger `novo-inscrito-newsletter` está configurado para chamar `supabase_functions.http_request` em um host `n8n.elimaj.com.br`. Isso confirma a configuração de origem, não a entrega de email nem a execução bem-sucedida do workflow. `interaction_logs` consta na publicação `supabase_realtime`. Não existe `cron.job` nesse banco; as extensões instaladas são plpgsql, pg_stat_statements, uuid-ossp, pgcrypto, supabase_vault e pg_net. Dependências de Vault e webhooks precisam ser tratadas sem importar serviços da plataforma.

As contagens são um retrato da consulta e devem ser repetidas no corte final. O campo `rows` retornado pela ferramenta de listagem de tabelas estava zerado; foram usadas consultas `count(*)`, não essas estimativas.

### Destino verificado

- SSH funcional em `eduardo@192.168.0.101`, Ubuntu 24.04.3 LTS.
- Container `postgres-apps`, imagem `postgres:16-alpine`, versão efetiva PostgreSQL 16.15.
- Rede Docker `postgres-apps`; porta 5432 sem publicação no host.
- Persistência em volume Docker `postgres_apps_data`, montado em `/var/lib/postgresql/data`.
- Existem os bancos `postgres` e `desdobra`. Não existe banco do portfolio ainda. Criar banco e usuários próprios, preservando o banco do Desdobra e a configuração compartilhada.
- Limite atual de 100 conexões; `wal_level=replica` e `archive_mode=off`. Isso não determina se já há backups lógicos agendados; seus procedimentos e retenção ainda precisam ser verificados.
- Cerca de 3,2 GB de RAM total, 1,5 GB disponível na inspeção e 22 GB livres na raiz. Usar backend enxuto e pool limitado; capacidade e restauração precisam de teste com a aplicação.
- Containers de Cloudflare Tunnel e n8n estão presentes. Roteamento do domínio, healthchecks, TLS público e entrega do webhook ainda não foram verificados.

| Fluxo | Dependência encontrada | Evidência local |
| --- | --- | --- |
| Newsletter | Inserção pelo navegador em `newsletter_subscribers` | `apps/portfolio/src/pages/Newsletter.tsx`, `apps/portfolio/src/components/landing/NewsletterModal.tsx` |
| Chat | REST do Supabase para histórico, limite diário, conhecimento e gravação de interações | `apps/portfolio/api/chat.js` |
| Painel | Leitura de `interaction_logs` e atualização de `is_read` | `apps/portfolio/src/pages/Dashboard.tsx` |
| Atualização do painel | Supabase Realtime com `postgres_changes` | `apps/portfolio/src/pages/Dashboard.tsx` |
| Login administrativo | Supabase Auth e RPC `is_dashboard_admin` | `apps/portfolio/src/components/auth/RequireAdmin.tsx` |
| Autorização | `profiles`, referência a `auth.users`, `auth.uid()`, `auth.jwt()` e RLS | `supabase/rls/interaction_logs.sql` |
| Automação de newsletter | Trigger HTTP existente com host n8n; entrega não testada | Catálogo remoto e `docs/automacao-n8n.md` |

Não foram encontradas chamadas de Storage ou Edge Functions nos diretórios de código inspecionados e a origem remota não tinha arquivos nem Edge Functions na consulta. O conteúdo do site também tem integração com Sanity; preservar essa integração, pois a saída solicitada é do Supabase.

## Decisão de arquitetura

O banco do Supabase já é PostgreSQL. A principal mudança será de hospedagem e dos serviços usados para acessá-lo.

Para aproveitar o PostgreSQL existente e cumprir a saída completa, a arquitetura proposta é:

```text
Navegador → domínio público HTTPS / Cloudflare Tunnel
         → aplicação do portfolio no servidor
           ├─ arquivos estáticos do site React
           └─ API Node em /api
              ├─ PostgreSQL: banco exclusivo do portfolio
              ├─ autenticação e autorização próprias
              ├─ OpenAI, para o chat existente
              └─ n8n, para a newsletter
```

O navegador chama a API. Credenciais do PostgreSQL ficam somente no backend. A API autentica o usuário e verifica seu papel antes de consultar ou alterar dados administrativos.

Site e API terão a mesma origem pública, simplificando cookies e evitando dependência de funções na Vercel. A API se conectará ao banco pela rede Docker, sem publicar PostgreSQL na internet. Usar o Cloudflare Tunnel já presente, depois de verificar sua configuração e preparar o roteamento do domínio. Validar streaming, timeouts e cookies pelo caminho público completo. O IP 192.168.0.101 é o endereço de administração local por SSH, não o endereço público do site.

O backend atual `apps/portfolio/api/chat.js` declara runtime Edge da Vercel. Adaptá-lo para o runtime Node do novo servidor preservando `/api/chat` e os eventos do streaming; não presumir que a função atual possa receber apenas uma connection string PostgreSQL. Os arquivos estáticos podem ser servidos pelo processo de aplicação ou por um proxy HTTP leve; escolher a implementação na etapa de código e validar o comportamento SPA e `/api`.

### Compatibilidade PostgreSQL 17 → 16

Não executar uma restauração cega do dump completo da versão 17 sobre o cluster 16 compartilhado. A restauração de dumps para uma versão principal anterior não tem garantia de compatibilidade. O caminho proposto aproveita os tipos comuns verificados: criar esquema próprio compatível com PostgreSQL 16, substituir objetos de Auth/RLS/webhook dependentes do Supabase e importar apenas os dados necessários por um procedimento versionado e testado. A restauração em homologação deverá demonstrar essa compatibilidade antes do corte. Se forem encontradas dependências incompatíveis, revisar o destino; não atualizar o cluster compartilhado automaticamente.

Guardar também backup original consistente da origem, produzido com ferramenta compatível com a versão 17. Não importar schemas `auth`, `storage`, `realtime`, funções `supabase_functions`, roles e extensões internas como se fossem a aplicação independente. O material necessário ao único usuário deverá ser importado com segurança para o novo modelo de autenticação.

Substituir os serviços usados pelo seguinte conjunto:

| Serviço atual | Destino proposto |
| --- | --- |
| Banco Supabase | Banco dedicado no PostgreSQL existente |
| REST/PostgREST consumido pela aplicação | Endpoints próprios na API |
| Supabase Auth e RPC administrativo | Autenticação independente do Supabase e autorização no backend |
| Supabase Realtime | Polling, SSE ou WebSocket, conforme a latência necessária |
| Webhook de newsletter, se ativo | Evento confiável da API para n8n |
| Storage, se confirmado no inventário | Armazenamento de arquivos separado do PostgreSQL |

Login e acesso aos dados serão preparados juntos em homologação antes do corte. Não manter Supabase Auth como dependência da aplicação após a troca nem instalar a stack Supabase no servidor. O projeto de origem será preservado apenas durante a janela de retorno, sem receber tráfego da aplicação após o corte.

Escolher o mecanismo de autenticação após confirmar usuários, métodos de acesso, recuperação de senha e MFA utilizados. Usar componentes de autenticação mantidos e compatíveis com a arquitetura, evitando implementar criptografia própria. Prever sessões seguras, expiração e revogação, proteção contra tentativas repetidas e recuperação de acesso.

## Etapa 1 — Inventário de origem e destino

1. Aplicação, projeto Supabase e servidor confirmados; verificar o domínio público e a versão realmente publicada antes da implementação.
2. Versões, tamanho e contagens levantados; completar volume de escrita, conexões e dependências de outros consumidores.
3. Exportar catálogo: tabelas, colunas, tipos, chaves, índices, sequences, views, funções, triggers, extensões, grants e políticas RLS. Mapear dependências entre schemas.
4. Levantar Auth, usuários/identidades, provedores de login, SMTP, callbacks, sessões, recuperação e MFA.
5. Verificar Storage, Realtime, Edge Functions, cron, webhooks e consumidores externos, incluindo n8n.
6. Inspecionar o servidor em modo de leitura: instalação nativa ou container, volumes, RAM, CPU, disco livre, acesso de rede, backups e restauração.
7. Definir janela máxima sem escritas, perda máxima aceitável de dados e tempo máximo de recuperação.

Resultado: inventário confirmado e decisão de arquitetura. Não estimar a duração da migração apenas pelo número de arquivos no repositório.

## Etapa 2 — Preparar o destino

1. Criar banco de homologação separado dos bancos existentes.
2. Definir usuários distintos para migração e execução da aplicação; a aplicação não usa superusuário.
3. Criar e testar o esquema de aplicação compatível com PostgreSQL 16 conforme a decisão de versões acima; usar ferramenta de backup compatível com a origem 17. Não restaurar a stack inteira da plataforma.
4. Configurar persistência, rede, TLS onde aplicável, pool, limites de conexão e monitoramento.
5. Configurar backups fora do servidor e testar sua restauração. Definir retenção e responsáveis; avaliar WAL/PITR conforme a perda máxima aceitável.

Resultado: ambiente preparado e recuperação demonstrada.

## Etapa 3 — Adaptar a aplicação em homologação

- Introduzir camada de acesso a dados no backend e consultas parametrizadas.
- Criar endpoint público de newsletter com validação, controle de abuso e tratamento de duplicados; substituir as duas inserções feitas no navegador.
- Migrar o chat preservando histórico, ordenação, contagem diária em UTC, consulta de conhecimento e gravação das interações. Confirmar sucesso (`done` no streaming ou resposta final sem streaming) somente depois de commit da gravação ou aceite em um mecanismo durável com recuperação demonstrada. O backend atual agenda a gravação em background após a resposta; a substituição deve tratar explicitamente essa possibilidade de perda.
- Aplicar limite de uso com reserva/contagem atômica no backend, incluindo requisições concorrentes. O `sessionId` vem do navegador e não constitui identidade confiável: complementar com rate limit no servidor e regras para criação/troca de sessão. Testar banco indisponível, concorrência e repetição/troca de IDs; a falha da consulta não deve liberar silenciosamente consumo ilimitado de IA. Definir também o comportamento de falha de histórico/conhecimento e evitar sucesso aparente quando dados necessários não foram carregados.
- Criar endpoints administrativos para leitura de interações e marcação de leitura. Proteger todos no backend; esconder a tela não garante autorização.
- Substituir Supabase Auth por autenticação independente. Para o único usuário encontrado, importar UUID, email e hash bcrypt através de um canal protegido e preservar o perfil administrativo. Validar o hash no novo backend e planejar novo login/invalidação de sessões. Usar cookies HttpOnly, Secure e SameSite apropriado, expiração, revogação e proteção CSRF nas ações pertinentes. Definir recuperação de acesso independente do Supabase. Copiar `auth.users` não cria, por si só, um serviço de login funcional.
- Adaptar funções, grants e RLS dependentes de `auth.*` e dos papéis do Supabase. Preservar a regra de acesso correspondente na API e, quando apropriado, no banco; não remover proteção para resolver erros de restauração.
- Substituir Realtime conforme a necessidade: polling para atualização periódica ou SSE/WebSocket para atualização imediata. Definir a latência aceitável antes da escolha.
- Substituir o trigger HTTP confirmado da newsletter por entrega confiável da aplicação ao n8n. Usar outbox transacional com retries e event ID estável: a entrega pode ocorrer mais de uma vez, então exigir deduplicação persistente e idempotente no consumidor antes de disparar email. Validar o formato esperado pelo workflow e testar timeout/ack perdido sem enviar mensagens a inscritos reais no ensaio. A importação dos 19 inscritos existentes não deve gerar eventos de boas-vindas.

### Contratos mínimos de API

| Rota proposta | Comportamento |
| --- | --- |
| `POST /api/newsletter` | Receber name/email; validar e criar cadastro; preservar a experiência de email duplicado |
| `POST /api/chat` | Manter message/sessionId/stream e os eventos SSE `delta`, `done`, `error`; preservar resposta `{output}` sem streaming |
| `GET /api/auth/session` | Informar usuário e papel da sessão válida |
| `POST /api/auth/login` | Validar email/senha e criar sessão segura |
| `POST /api/auth/logout` | Revogar sessão e limpar cookie |
| `GET /api/admin/interactions` | Listar histórico com autorização administrativa e ordenação compatível |
| `PATCH /api/admin/sessions/:id/read` | Marcar interações da sessão como lidas, com autorização no backend |
| `GET /api/admin/events`, se SSE escolhido | Notificar inserts/updates autorizados, sem expor históricos a visitantes |

Separar arquivos de backend, adaptação do frontend e infraestrutura para a delegação. Além dos fluxos principais, revisar `src/lib/supabase.ts`, dependência do SDK, chunks do Vite, CSP com domínios Supabase, variáveis, documentação e menções de integração desatualizadas. Não remover Sanity, PostHog, OpenAI ou Telegram do escopo sem necessidade.

Resultado: os fluxos reais funcionam no destino de homologação, inclusive rejeição de acessos indevidos.

## Etapa 4 — Ensaio de exportação e restauração

1. Gerar backup consistente da origem e preservar uma cópia original protegida. Dumps podem conter dados pessoais e material de autenticação; não versionar no Git.
2. Definir o subconjunto a restaurar e suas dependências. Exportar apenas `public` sem tratar suas referências a `auth` não é suficiente neste projeto.
3. Adaptar objetos dependentes da plataforma em scripts versionados, sem modificar o backup original. Não importar cegamente roles internos ou executar grants do Supabase no cluster compartilhado.
4. Restaurar em homologação, com erros interrompendo o processo. Controlar triggers e integrações para que a importação não envie emails ou dispare automações externas.
5. Se houver Storage, migrar os arquivos separadamente, validar conteúdo, permissões, URLs e quantidade; o dump do banco contém metadados, não os arquivos.
6. Comparar contagens de todas as tabelas, IDs, integridade referencial, valores críticos, sequences e conteúdo usando checksums/comparação determinística conforme o volume. Validar tipos, JSON, timezone e encoding.
7. Atualizar estatísticas e avaliar consultas importantes, latência e consumo de conexões.
8. Medir exportação, transferência, restauração e validação para calcular a janela de troca.

Resultado: relatório de paridade, testes dos fluxos e duração medida.

## Etapa 5 — Troca de produção

Foi aceita uma janela de manutenção sem escritas. O volume é pequeno, mas a duração será definida após medir o ensaio, incluindo mudança de hospedagem e verificação pública. Replicação contínua não é necessária como ponto de partida.

1. Preparar release, configuração, scripts e plano de retorno antes da janela.
2. Suspender todas as origens de escrita: endpoints, frontend antigo, n8n, jobs, webhooks e conexões externas. Drenar requisições em andamento e verificar que a origem está estável.
3. Fazer exportação final consistente ou aplicar os deltas finais validados. Não sobrescrever dados sem critério.
4. Restaurar no destino e verificar paridade antes de liberar novas escritas.
5. Ativar a aplicação no servidor e trocar o roteamento público do domínio para o destino preparado. Preservar DNS/roteamento e release anteriores para retorno; validar TLS, site, rotas SPA e `/api`. Tratar clientes antigos e chamadas diretas para que não continuem gravando na origem.
6. Executar smoke tests no ambiente real, inicialmente com integrações externas controladas.
7. Liberar escritas no destino e reativar consumidores necessários, com deduplicação de eventos.
8. Monitorar erros, logins, newsletter, persistência do chat, atualizações do painel, latência e conexões.

Manter uma única origem de escrita ativa. Dual write exige um desenho específico de consistência e recuperação e não é o padrão deste plano.

## Retorno em caso de falha

- Antes de liberar escritas no destino: reverter release/configuração e reabrir a origem preservada após verificar sua integridade.
- Depois de liberar escritas no destino: congelar as escritas, preservar backup e identificar alterações desde o corte. Reconciliar INSERT, UPDATE e DELETE antes de voltar para o Supabase, ou corrigir no destino. Apenas trocar a conexão de volta pode perder cadastros e conversas.
- Definir gatilhos de retorno: falha de autorização, perda de gravações, divergência de dados ou indisponibilidade acima do limite combinado. Guardar versões e configurações necessárias sem expor segredos.
- Encerrar o Supabase somente após o período de observação definido, eliminação das dependências, validação de backups e decisão sobre retenção dos dados e material de Auth.

## Critérios para considerar concluído

- Paridade das tabelas migradas e integridade referencial comprovadas.
- Cadastro de newsletter e duplicados funcionam; automação confirmada recebe o evento uma única vez nos cenários testados.
- Chat consulta conhecimento e histórico, aplica limite diário/rate limit no backend inclusive sob concorrência e confirma sucesso apenas com persistência durável. Falhas de banco e troca/repetição de sessionId são exercitadas.
- Admin acessa e atualiza o painel; visitante e usuário sem papel administrativo recebem rejeição da API.
- Login/logout, sessões e recuperação de acesso funcionam sem Supabase.
- Atualização do painel atende à latência acordada.
- Restauração de backup e procedimento de retorno demonstrados.
- Logs e métricas de produção observados após a troca.
- Nenhuma dependência de execução do Supabase permanece: SDK, endpoints, tokens, chaves e URLs ativos foram substituídos ou removidos. A aplicação deve passar pelos testes dos fluxos com o acesso ao Supabase bloqueado no ambiente de validação.

## Implementação com Orchestrate

A implementação foi conduzida com a skill `C:/Users/dulim/.codex/skills/orchestrate/SKILL.md`, conforme solicitado. As frentes de inventário, backend, frontend e infraestrutura foram delegadas; integração, validação, migração de staging e controle do corte ficaram centralizados no agente principal.
- `gpt-6.1-sol`: revisão de Auth/autorização e decisões com forte acoplamento ou risco material, quando necessário.
- Divulgar tarefa, modelo e esforço antes de cada delegação. Evitar edições simultâneas nos mesmos arquivos.
- Preparar e validar o resultado em homologação antes de executar o corte combinado.

## Decisões confirmadas e acompanhamento pós-corte

Confirmado: este portfolio, saída completa do Supabase, SSH `eduardo@192.168.0.101`, site e API no servidor, PostgreSQL existente e janela de manutenção aceita.

Concluído: exportação final e sincronização transacional, paridade de contagens, autenticação por hash bcrypt importada, backup e ensaio de restauração, serviço privado em `8011`, rotas públicas HTTPS, workflows n8n ativos e smoke tests externos. Os testes cobrem autorização da API, que devolveu 401 sem sessão.

Pendências pós-corte:

1. Validar o login administrativo, painel e recuperação de acesso com o responsável. Sessões Supabase anteriores exigem novo login.
2. Implementar e provar deduplicação persistente por ID no consumidor n8n antes de habilitar `NEWSLETTER_DELIVERY_ENABLED`; nenhum email de boas-vindas foi enviado neste corte.
3. Monitorar erros, cadastros, conversas, painel, latência e backups durante o período de observação. Manter Supabase e backups atuais disponíveis para retorno; reconciliar gravações posteriores antes de qualquer reversão.
4. Depois do período de observação, decidir se e quando excluir o projeto Supabase e os dados de origem. Essa decisão é posterior ao corte e ainda não foi tomada.

Não compartilhar senhas neste documento ou no chat. Segredos operacionais permanecem somente nos arquivos protegidos do servidor.

## Referências oficiais

- [PostgreSQL: pg_dump e compatibilidade entre versões](https://www.postgresql.org/docs/current/app-pgdump.html)
- [Supabase: backup e restauração com CLI](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore) — guia entre projetos Supabase; requer adaptação para PostgreSQL independente.
- [Supabase: backups e limite relativo ao Storage](https://supabase.com/docs/guides/platform/backups)
- [Supabase: hospedagem própria e responsabilidades operacionais](https://supabase.com/docs/guides/self-hosting)
