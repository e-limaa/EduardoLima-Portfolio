DO $$
DECLARE
  app_role text;
BEGIN
  IF current_user !~ '^portfolio_owner_[a-z0-9_]+$' THEN
    RAISE EXCEPTION 'Migrations must run as an environment-specific portfolio owner role';
  END IF;

  app_role := regexp_replace(current_user, '^portfolio_owner_', 'portfolio_app_');
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = app_role AND rolcanlogin) THEN
    RAISE EXCEPTION 'Expected a dedicated login role named %', app_role;
  END IF;

  -- The admin inbox reads messages and can only flip the read flag.
  EXECUTE format('GRANT SELECT, UPDATE (is_read) ON TABLE %I.contact_messages TO %I', current_schema(), app_role);
END;
$$;
