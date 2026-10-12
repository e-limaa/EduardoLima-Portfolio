CREATE TABLE contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  email text CHECK (email IS NULL OR length(email) <= 254),
  phone text CHECK (phone IS NULL OR length(phone) <= 40),
  company text CHECK (company IS NULL OR length(company) <= 120),
  message text NOT NULL CHECK (length(message) BETWEEN 1 AND 4000),
  is_read boolean NOT NULL DEFAULT false,
  CHECK (email IS NOT NULL OR phone IS NOT NULL)
);
CREATE INDEX contact_messages_created ON contact_messages(created_at DESC);

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

  -- The API only records messages; reading them is an operator/admin task.
  EXECUTE format('GRANT INSERT ON TABLE %I.contact_messages TO %I', current_schema(), app_role);
END;
$$;
