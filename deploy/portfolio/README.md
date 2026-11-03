# Execução do portfolio no servidor

A imagem compila o workspace React com Node 22, instala as dependências próprias da API e serve os arquivos e as rotas `/api` pelo mesmo processo. O container usa a rede Docker externa `postgres-apps`; a porta publicada fica presa ao loopback do servidor. Em produção, também compartilha a rede privada do Cloudflare Tunnel (`n8n_n8n_default`) para o túnel alcançar o container sem publicar uma porta de origem. O PostgreSQL não recebe uma porta pública.

O Sanity Studio é compilado e servido por um container estático separado, habilitado somente no deploy de produção pelo perfil `cms`. Ele fica apenas na rede do Cloudflare Tunnel, sem porta publicada e sem acesso à rede PostgreSQL. A origem estável para a rota pública do Cloudflare é `http://portfolio-studio-production:3333`. O Studio continua conectado ao projeto `mxq3x3cp`, dataset `production`; conteúdo, documentos e imagens permanecem no Sanity. Antes de trocar a rota, confirme que `https://cms.elimaj.com.br` está liberado na lista CORS do projeto Sanity com credenciais habilitadas e teste o login e a edição de um documento. Não use um Studio de staging para editar: o schema atual aponta para o dataset de produção.

## Arquivos de ambiente

Copie `env.example` para `/home/eduardo/portfolio/staging.env` e `/home/eduardo/portfolio/production.env`. Preencha cada arquivo no servidor e aplique `chmod 600`. Use usuários e bancos separados para staging e produção. `DATABASE_URL` é o papel de execução da API; `MIGRATION_DATABASE_URL` é a conexão privilegiada usada apenas pelo serviço de migração. O `MIGRATION_OWNER_ROLE` deve ser o papel proprietário sem login daquele ambiente. A API não recebe a conexão privilegiada.

Staging usa `NODE_ENV=development`, `PUBLIC_ORIGIN=http://127.0.0.1:8010` e a porta 8010 para permitir a validação local por túnel SSH. Produção usa `NODE_ENV=production`, origem HTTPS pública e a porta 8011. O script seleciona o ambiente e verifica a porta. A rota pública no Cloudflare Tunnel deve apontar para `http://portfolio-production_app_1:3000` somente após validar a aplicação e a rede privada.

Defina `CF_PROXY_HOSTS` com o nome DNS do container do `cloudflared` na rede `n8n_n8n_default` (o nome do serviço ou um alias; confira com `docker inspect` no container do túnel). A API resolve esse nome na inicialização e a cada minuto e só aceita o cabeçalho `cf-connecting-ip` vindo desses endereços exatos. Os demais containers da rede compartilhada, como o n8n, continuam sem poder informar o IP do visitante. Sem essa variável, todo o tráfego do túnel chega com o IP do `cloudflared` e os limites de login, chat, newsletter e contato passam a valer para todos os visitantes juntos. Em produção, a API registra um aviso no log quando a variável está vazia.

Mantenha no arquivo protegido os valores atuais de `OPENAI_API_KEY`, `OPENAI_MODEL` e `OPENAI_INSTRUCTIONS`, além dos demais limites já definidos. `OPENAI_STORE` permanece `false`. A entrega da newsletter fica desligada por padrão; quando habilitada, a API entrega o envelope compatível com o webhook do n8n, inclui o ID estável do evento, autentica com `NEWSLETTER_WEBHOOK_SECRET` e agenda retries com atraso. Antes de habilitar em produção, configure autenticação e deduplicação persistente no consumidor usando esse ID: a outbox oferece entrega pelo menos uma vez, então um timeout depois do aceite pode repetir o email. Telegram só envia notificações se ambos os valores forem configurados.

## Publicar uma versão

No checkout da versão desejada no servidor:

```bash
bash deploy/portfolio/deploy.sh staging /home/eduardo/portfolio/staging.env
```

Depois de validar staging, publique a mesma revisão em produção:

```bash
bash deploy/portfolio/deploy.sh production /home/eduardo/portfolio/production.env
```

O script guarda a imagem em uso como `:previous`, constrói a nova, aplica as migrações pendentes pelo papel proprietário e sobe a imagem nova num container temporário (`<projeto>_preflight`, sem porta publicada) até o healthcheck ficar `healthy`. Se o preflight falhar, o app em execução não é tocado. Depois troca o container (a indisponibilidade fica restrita ao stop/start) e espera o healthcheck; se o novo container não ficar saudável, volta sozinho para a imagem `:previous`. As migrações aplicadas permanecem, por isso elas precisam continuar compatíveis com a versão anterior. O script usa `docker compose` v2 quando disponível; com o `docker-compose` 1.29 os serviços são sempre removidos antes do `up`, o que evita o erro `KeyError: 'ContainerConfig'` no Docker atual. Em produção ele também constrói e inicia o container estático do Studio; staging não habilita esse serviço para evitar edição acidental do dataset de produção. Ele não recria o container do PostgreSQL nem altera seu volume compartilhado. Verifique a saúde local com `curl -fsS http://127.0.0.1:8010/api/health` em staging ou `curl -fsS http://127.0.0.1:8011/api/health` em produção. A resposta inclui o estado da conexão, sem dados de usuários.

## Publicação automática após merge

O workflow `.github/workflows/portfolio-ci.yml` testa a API e o controlador de deploy e compila o portfolio e o Studio nos PRs para `main` e nos pushes para `main`. Abrir o PR não publica em produção. Depois do merge, a rotina do servidor verifica a `main` a cada dois minutos e exige que o **mesmo SHA** tenha um run de `Portfolio CI` acionado por `push`, concluído com sucesso. Se outro merge cancelar um CI antigo, a rotina aguarda o CI da revisão mais recente. Pushes diretos na `main` também passam pelo mesmo fluxo; para exigir PR, configure proteção de branch no GitHub.

A rotina usa somente conexões HTTPS de saída para o repositório público. Ela não precisa de token do GitHub, chave SSH de produção no GitHub ou runner instalado no servidor. A publicação usa `/home/eduardo/portfolio/production.env`, já protegido no servidor, inclusive para os argumentos públicos do build. Se o repositório se tornar privado, a consulta e o fetch param até a autenticação ser configurada separadamente.

Cada publicação cria uma pasta própria em `/home/eduardo/portfolio/releases`, salva um backup do PostgreSQL antes de executar o deploy e só atualiza o link `current` e o estado de sucesso depois que o script termina. `previous` guarda o destino anterior de `current`. Não há limpeza automática de releases ou imagens: monitore espaço e faça a retenção com um plano específico. O banco e os segredos não ficam dentro das releases.

O script testa app e Studio em containers temporários antes da troca e preserva as imagens realmente em uso. Uma falha ao iniciar ou validar o app ou o Studio tenta restaurar as imagens anteriores de ambos os serviços afetados. Migrações aplicadas permanecem e precisam ser compatíveis com a versão anterior; o dump é a recuperação disponível para o banco. O deploy tem uma breve interrupção durante a troca de containers. Um lock impede duas publicações simultâneas; não execute o deploy manual enquanto a rotina estiver em andamento.

### Instalação única no Elimaj

A instalação exige um plano concreto aprovado pelo humano pelo cliente `Solicitar-servidor.ps1`. O instalador não altera SSH, sudoers ou grupos e exige que `eduardo` já tenha o acesso Docker necessário ao deploy existente. O código do controlador fica fixado em `/usr/local/lib/portfolio-autodeploy`, de propriedade de root: novos merges não substituem esse controlador. Atualizá-lo exige outro plano aprovado.

Após incorporar estes arquivos na `main`, execute **pelo fluxo de aprovação**, em uma cópia da revisão revisada:

```bash
bash deploy/portfolio/install-autodeploy.sh
```

O instalador habilita apenas `portfolio-autodeploy.timer`. Na primeira rodada, a rotina pode publicar a `main` atual se o respectivo CI já passou; ela não exige um novo merge depois da instalação. A aprovação dessa rotina autoriza as futuras publicações automáticas desse repositório e branch. Os jobs de CI continuam em runners do GitHub e não recebem segredos de produção.

### Acompanhar, pausar e recuperar

```bash
systemctl status portfolio-autodeploy.timer portfolio-autodeploy.service
journalctl -u portfolio-autodeploy.service -n 100 --no-pager
cat /home/eduardo/portfolio/autodeploy/status.json
```

O estado informa `attempted_sha`, `deployed_sha`, `result` e a release concluída. Uma revisão com falha ou uma execução interrompida não é repetida automaticamente. O próximo commit validado pode publicar normalmente. Depois de diagnosticar a causa, uma repetição explícita da `main` atual pode ser executada pelo humano como `eduardo`, com o mesmo lock do controlador:

```bash
python3 /usr/local/lib/portfolio-autodeploy/auto-deploy.py --retry-failed
```

Para impedir novas rodadas, desabilite o timer. Isso não interrompe uma publicação em andamento e não reverte a versão já publicada:

```bash
sudo systemctl disable --now portfolio-autodeploy.timer
```

Para reverter o app e o Studio, use `deploy.sh production` no destino revisado de `previous` pelo fluxo aprovado. Migrações não são desfeitas automaticamente. Se rollback ou restauração de banco forem necessários, diagnostique e aprove um plano específico antes de executá-los.

## Importar a exportação protegida

Coloque o JSON descriptografado em `/home/eduardo/portfolio/portfolio-export.json`, com modo `600` e proprietário correspondente ao `IMPORT_UID`/`IMPORT_GID` configurado. A importação só aceita os cinco arrays canônicos `users`, `profiles`, `newsletter_subscribers`, `interaction_logs` e `agent_knowledge`; rejeita campos inesperados, emails duplicados sem distinção entre maiúsculas e minúsculas, referências de perfil ausentes e hashes fora do formato bcrypt. Os metadados de autenticação que poderiam carregar papéis controlados pelo usuário não são importados. IDs e horários são preservados.

Após aplicar a migração no banco isolado de staging, confira `IMPORT_FILE`, as permissões `600` e o proprietário configurado. Em seguida, execute:

```bash
docker-compose --project-name portfolio-staging --env-file /home/eduardo/portfolio/staging.env -f deploy/portfolio/compose.yml --profile tools run --rm import
```

Por padrão, todas as tabelas de origem devem estar vazias. `--allow-existing` existe somente para uma repetição revisada: ele faz upsert por ID, não limpa tabelas e a transação inteira reverte se outra restrição for violada. A saída mostra contagens e o SHA-256 do arquivo, sem exibir linhas, emails ou hashes bcrypt. A importação não cria eventos na outbox e não envia mensagens.

## Backup e restauração de verificação

O backup usa `MIGRATION_DATABASE_URL` para criar um arquivo custom do `pg_dump`, sem ownership ou ACLs, em `/home/eduardo/portfolio/backups`. Diretório, dump e manifesto ficam restritos ao usuário do servidor. Execute:

```bash
bash scripts/portfolio/backup.sh staging /home/eduardo/portfolio/staging.env
```

O manifesto contém o SHA-256 do arquivo. Para uma restauração de ensaio, configure `VERIFY_DATABASE_URL` para um banco vazio dedicado chamado `portfolio_verify` ou `portfolio_verify_staging`, com permissões de conexão e criação no schema `public`. O script verifica o digest, recusa qualquer relação já existente e restaura em uma transação única. Ele nunca apaga nem limpa um banco. O banco de verificação deve ser criado separadamente; após comparar as contagens, remova somente esse banco temporário de ensaio.

```bash
bash scripts/portfolio/verify-restore.sh /home/eduardo/portfolio/backups/portfolio-staging-<timestamp>-<id>.dump /home/eduardo/portfolio/staging.env
```

Esse procedimento demonstra a leitura do arquivo e a restauração lógica no servidor.

### Backup agendado

`scripts/portfolio/backup-scheduled.sh` gera os dumps de produção e staging, mantém 14 dias (sempre ao menos os 3 mais recentes de cada ambiente; ajuste com `PORTFOLIO_BACKUP_RETENTION_DAYS` e `PORTFOLIO_BACKUP_MIN_KEEP`) e só apaga dumps antigos quando a rodada inteira deu certo. Com `PORTFOLIO_BACKUP_RSYNC_TARGET` definido, copia os dumps para fora do servidor via rsync. Mantenha `/home/eduardo/portfolio/current` apontando para a release ativa (`ln -sfn release-<data> /home/eduardo/portfolio/current`) e agende no crontab do usuário:

```cron
15 4 * * * /home/eduardo/portfolio/current/scripts/portfolio/backup-scheduled.sh >> /home/eduardo/portfolio/backups/scheduled.log 2>&1
```
