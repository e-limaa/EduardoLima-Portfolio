CREATE TABLE app_users (
  id uuid PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  email_confirmed_at timestamptz,
  raw_user_meta_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  raw_app_meta_data jsonb NOT NULL DEFAULT '{}'::jsonb
);
CREATE UNIQUE INDEX app_users_email_normalized ON app_users (lower(email));
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
  email text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin','owner','superadmin')),
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text,
  email text NOT NULL UNIQUE
);
CREATE UNIQUE INDEX newsletter_email_normalized ON newsletter_subscribers (lower(email));
CREATE TABLE interaction_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,
  user_message text,
  ai_response text,
  timestamp timestamptz DEFAULT now(),
  is_read boolean DEFAULT false
);
CREATE INDEX interaction_session_timestamp ON interaction_logs(session_id, timestamp DESC);
CREATE INDEX interaction_timestamp ON interaction_logs(timestamp DESC);
CREATE TABLE agent_knowledge (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text,
  content text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE app_sessions (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);
CREATE INDEX app_sessions_expiration ON app_sessions(expires_at);
CREATE TABLE app_rate_limits (
  scope text NOT NULL,
  window_start timestamptz NOT NULL,
  used integer NOT NULL CHECK (used > 0),
  PRIMARY KEY (scope,window_start)
);
CREATE TABLE chat_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'reserved' CHECK(status IN ('reserved','completed','failed','expired')),
  interaction_id uuid REFERENCES interaction_logs(id)
);
CREATE INDEX chat_reservations_ip_time ON chat_reservations(ip_hash,created_at);
CREATE INDEX chat_reservations_session_time ON chat_reservations(session_id,created_at);
CREATE INDEX chat_reservations_active ON chat_reservations(status,expires_at);
CREATE TABLE newsletter_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id uuid NOT NULL UNIQUE REFERENCES newsletter_subscribers(id),
  event_type text NOT NULL DEFAULT 'newsletter.subscribed',
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  attempts integer NOT NULL DEFAULT 0,
  next_attempt_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz,
  last_error text
);
