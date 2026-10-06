# Execução do portfolio no servidor

A imagem compila o workspace React com Node 22, instala as dependências próprias da API e serve os arquivos e as rotas `/api` pelo mesmo processo. O container usa a rede Docker externa `postgres-apps`; a porta publicada fica presa ao loopback do servidor. Em produção, também compartilha a rede privada do Cloudflare Tunnel (`n8n_n8n_default`) para o túnel alcançar o container sem publicar uma porta de origem. O PostgreSQL não recebe uma porta pública.

O Sanity Studio é compilado e servido por um container estático separado, habilitado somente no deploy de produção pelo perfil `cms`. Ele fica apenas na rede do Cloudflare Tunnel, sem porta publicada e sem acesso à rede PostgreSQL. A origem estável para a rota pública do Cloudflare é `http://portfolio-studio-production:3333`. O Studio continua conectado ao projeto `mxq3x3cp`, dataset `production`; conteúdo, documentos e imagens permanecem no Sanity. Antes de trocar a rota, confirme que `https://cms.elimaj.com.br` está liberado na lista CORS do projeto Sanity com credenciais habilitadas e teste o login e a edição de um documento. Não use um Studio de staging para editar: o schema atual aponta para o dataset de produção.

## Arquivos de ambiente

Copie `env.example` para `/home/eduardo/portfolio/staging.env` e `/home/eduardo/portfolio/production.env`. Preencha cada arquivo no servidor e aplique `chmod 600`. Use usuários e bancos separados para staging e produção. `DATABASE_URL` é o papel de execução da API; `MIGRATION_DATABASE_URL` é a conexão privilegiada usada apenas pelo serviço de migração. O `MIGRATION_OWNER_ROLE` deve ser o papel proprietário sem login daquele ambiente. A API não recebe a conexão privilegiada.

Staging usa `NODE_ENV=development`, `PUBLIC_ORIGIN=http://127.0.0.1:8010` e a porta 8010 para permitir a validação local por túnel SSH. Produção usa `NODE_ENV=production`, origem HTTPS pública e a porta 8011. O script seleciona o ambiente e verifica a porta. A rota pública no Cloudflare Tunnel deve apontar para `http://portfolio-production_app_1:3000` somente após validar a aplicação e a rede privada.

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

O script constrói a imagem, aplica as migrações pendentes pelo papel proprietário e só então inicia/atualiza o serviço. Em produção ele também constrói e inicia o container estático do Studio; staging não habilita esse serviço para evitar edição acidental do dataset de produção. Ele não recria o container do PostgreSQL nem altera seu volume compartilhado. Verifique a saúde local com `curl -fsS http://127.0.0.1:8010/api/health` em staging ou `curl -fsS http://127.0.0.1:8011/api/health` em produção. A resposta inclui o estado da conexão, sem dados de usuários.

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

Esse procedimento demonstra a leitura do arquivo e a restauração lógica no servidor. Retenção e cópia fora do servidor ainda precisam ser configuradas no serviço de backup adotado.
