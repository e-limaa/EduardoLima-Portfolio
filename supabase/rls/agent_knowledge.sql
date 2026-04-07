-- Lock down public.agent_knowledge, which is exposed through the Supabase Data API
-- because it lives in the public schema.
--
-- Safe default:
-- - enable RLS
-- - do not add public policies
-- - preserve integrations that already use service_role, which bypasses RLS
--
-- Apply this in the Supabase SQL editor with a privileged role.
-- Idempotent: safe to run multiple times.

do $$
begin
  if to_regclass('public.agent_knowledge') is null then
    raise notice 'Table public.agent_knowledge does not exist. Skipping.';
    return;
  end if;

  execute 'alter table public.agent_knowledge enable row level security';
end
$$;

-- No policies are created on purpose.
-- With RLS enabled and no policies, anon/authenticated clients cannot read or
-- mutate rows through the Data API.
--
-- If you later need dashboard admins to read this table from the frontend,
-- create a minimal SELECT policy instead of disabling RLS again, for example:
--
-- drop policy if exists "agent_knowledge_admin_select" on public.agent_knowledge;
-- create policy "agent_knowledge_admin_select"
-- on public.agent_knowledge
-- for select
-- to authenticated
-- using (public.is_dashboard_admin());
