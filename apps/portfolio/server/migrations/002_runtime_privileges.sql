DO $$
DECLARE
  app_role text;
  role_privileges text;
  relation_name text;
BEGIN
  IF current_user !~ '^portfolio_owner_[a-z0-9_]+$' THEN
    RAISE EXCEPTION 'Migrations must run as an environment-specific portfolio owner role';
  END IF;

  app_role := regexp_replace(current_user, '^portfolio_owner_', 'portfolio_app_');
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = app_role AND rolcanlogin) THEN
    RAISE EXCEPTION 'Expected a dedicated login role named %', app_role;
  END IF;

  EXECUTE format('GRANT USAGE ON SCHEMA public TO %I', app_role);
  FOR relation_name, role_privileges IN
    SELECT * FROM (VALUES
      ('app_users', 'SELECT'),
      ('profiles', 'SELECT'),
      ('newsletter_subscribers', 'SELECT, INSERT'),
      ('interaction_logs', 'SELECT, INSERT, UPDATE'),
      ('agent_knowledge', 'SELECT'),
      ('app_sessions', 'SELECT, INSERT, DELETE'),
      ('app_rate_limits', 'SELECT, INSERT, UPDATE, DELETE'),
      ('chat_reservations', 'SELECT, INSERT, UPDATE, DELETE'),
      ('newsletter_outbox', 'SELECT, INSERT, UPDATE')
    ) AS grants(relation_name, role_privileges)
  LOOP
    EXECUTE format('GRANT %s ON TABLE public.%I TO %I', role_privileges, relation_name, app_role);
  END LOOP;
END;
$$;
