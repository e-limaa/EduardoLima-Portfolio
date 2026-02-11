# Guia de Automação: Email de Boas-Vindas com n8n

Sim, é totalmente possível (e recomendado) enviar um e-mail automático assim que um usuário se cadastra.

A melhor forma de integrar o cadastro do site com o n8n é usando **Database Webhooks** do Supabase. Assim, toda vez que um novo registro for inserido na tabela `newsletter_subscribers`, o Supabase avisará o n8n automaticamente.

## Passo a Passo

### 1. No n8n (Configuração Inicial)
1.  Crie um novo Workflow no n8n.
2.  Adicione um nó **Webhook** como gatilho (Trigger).
3.  Defina o método HTTP como **POST**.
4.  Copie a **Webhook URL** (Test URL para testes, Production URL para final).
    *   *Dica: Comece usando a Test URL e clique em "Listen for Test Event" antes de fazer o cadastro.*

### 2. No Supabase (Criar Gatilho)
1.  Acesse seu [Dashboard do Supabase](https://supabase.com/dashboard).
2.  Vá em **Database** > **Webhooks** no menu lateral.
3.  Clique em **Create a new webhook**.
4.  Configure da seguinte forma:
    *   **Name**: `novo-inscrito-newsletter`
    *   **Table**: Selecione `public.newsletter_subscribers`.
    *   **Events**: Marque apenas **Insert**.
    *   **Type**: **HTTP Request**.
    *   **Method**: **POST**.
    *   **URL**: Cole a URL do Webhook do n8n (copiada no passo 1).
    *   **Headers**: Adicione um header de segurança se desejar (opcional).
5.  Clique em **Confirm**.

### 3. Testando a Integração
1.  No n8n, certifique-se de que o nó Webhook está em modo de escuta ("Listening").
2.  Vá no seu site (local ou produção) e faça um cadastro na Newsletter.
3.  Volte ao n8n. Você deverá ver os dados chegando no formato JSON, algo assim:
    ```json
    {
      "type": "INSERT",
      "table": "newsletter_subscribers",
      "record": {
        "id": "...",
        "name": "Nome do Usuário",
        "email": "email@usuario.com",
        "created_at": "..."
      },
      "schema": "public"
    }
    ```

### 4. No n8n (Enviar o E-mail)
1.  Adicione um nó de envio de e-mail conectado à saída do Webhook.
    *   Pode ser **Gmail**, **Outlook**, **AWS SES**, **SendGrid**, ou qualquer outro serviço que você use.
2.  Configure o nó de e-mail:
    *   **To (Para)**: Referencie o campo `expression` > `JSON` > `record` > `email`.
    *   **Subject (Assunto)**: "Bem-vindo à Newsletter!" (ou o que desejar).
    *   **Body (Corpo)**: Escreva sua mensagem. Você pode usar o `{{ $json.record.name }}` para personalizar.

### 5. Finalizando
1.  Salve o workflow no n8n.
2.  Ative o workflow (Switch "Active").
3.  No Supabase, edite o Webhook e troque a URL de Teste pela **Production URL** do n8n, se necessário.

Agora, sempre que alguém se cadastrar no site, o Supabase avisará o n8n, que enviará o e-mail automaticamente.
