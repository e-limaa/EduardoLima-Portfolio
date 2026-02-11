-- 1. Remover registros duplicados (mantendo o mais antigo)
WITH duplicates AS (
    SELECT id,
           ROW_NUMBER() OVER (
               PARTITION BY email 
               ORDER BY created_at ASC
           ) as row_num
    FROM public.newsletter_subscribers
)
DELETE FROM public.newsletter_subscribers
WHERE id IN (
    SELECT id 
    FROM duplicates 
    WHERE row_num > 1
);

-- 2. Adicionar constraint UNIQUE na coluna email
alter table public.newsletter_subscribers
add constraint newsletter_subscribers_email_key unique (email);
