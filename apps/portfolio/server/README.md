# Portfolio API

Node 22, PostgreSQL 16 and same-origin static React serving. This backend has no Supabase runtime dependency. It does not migrate automatically at startup.

Install reproducibly with `npm ci --prefix apps/portfolio/server --workspaces=false --ignore-scripts`. Start with `npm start --prefix apps/portfolio/server --workspaces=false`.

Required runtime environment:

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Dedicated DML-only application PostgreSQL role; never cluster administrator |
| `PUBLIC_ORIGIN` | Exact browser origin, such as `https://portfolio.example.com`; HTTPS required in production |
| `PUBLIC_ORIGINS` | Optional comma-separated list of additional exact HTTPS browser origins, such as a `www` alias |
| `RATE_LIMIT_SECRET` | Random secret of at least 32 characters; HMAC protects stored client-IP identifiers |
| `NODE_ENV` | `production` for deployment; local HTTP requires explicit `development` or `test` |

Optional runtime environment:

| Variable | Default |
| --- | --- |
| `HOST`, `PORT` | `0.0.0.0`, `3000` |
| `STATIC_DIR` | `apps/portfolio/dist`, resolved relative to module |
| `PG_POOL_MAX` | `5`, bounded at 20 |
| `SESSION_SECONDS` | `43200` (12 hours), bounded at 7 days |
| `CF_PROXY_CIDRS` | Empty: all client forwarding headers ignored. Configure only verified cloudflared peer IPs/CIDRs on an isolated network; do not trust all Docker/LAN networks. |
| `CF_PROXY_HOSTS` | Empty. Comma-separated DNS names of the cloudflared peers (for example its Docker service name). Resolved at startup and every 60 seconds; only those exact addresses may supply `cf-connecting-ip`. Preferred over `CF_PROXY_CIDRS` on a shared Docker network. Production logs a warning when both are empty, because every tunnelled visitor then shares one rate-limit bucket. |
| `CHAT_TIMEOUT_MS` | `30000`, maximum 120000 |
| `CHAT_DAILY_MESSAGES_PER_SESSION` | `30` |
| `CHAT_DAILY_MESSAGES_PER_IP` | `60` |
| `CHAT_CONCURRENCY_PER_IP`, `CHAT_GLOBAL_CONCURRENCY` | `2`, `5` |
| `OPENAI_API_KEY` | Required for actual chat generation |
| `OPENAI_MODEL` | Existing default `gpt-5.5` |
| `OPENAI_INSTRUCTIONS` | Existing portfolio instructions |
| `OPENAI_MAX_OUTPUT_TOKENS`, `OPENAI_MAX_OUTPUT_TOKENS_CAP` | `220`, `400` |
| `OPENAI_STORE` | `false`; `true` opts into provider storage |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Disabled unless both configured; notification occurs after interaction commit |
| `NEWSLETTER_DELIVERY_ENABLED`, `NEWSLETTER_WEBHOOK_URL`, `NEWSLETTER_WEBHOOK_SECRET` | Outbox delivery defaults off; enabling requires the fixed HTTPS n8n webhook, a 32+ character URL-safe shared secret, and persistent consumer deduplication |

Use `MIGRATION_DATABASE_URL` for the separate privileged DDL connection and, optionally, `MIGRATION_OWNER_ROLE=portfolio_owner_<environment>` to execute DDL as the no-login owner role. Run `npm run migrate --prefix apps/portfolio/server --workspaces=false` once per release. The runner verifies immutable SQL checksums and applies all pending migrations atomically under an advisory lock. Grant runtime role only DML privileges needed by the API; migration and import credentials are absent from the application container.

Browser mutations require an exact matching `Origin` from `PUBLIC_ORIGIN` or `PUBLIC_ORIGINS` (configured independently of the Host header). Login, newsletter and chat require JSON. There are no CORS allowances. The persisted opaque session cookie is HttpOnly, Secure on HTTPS, SameSite=Strict, path `/`, with a `__Host-` prefix in production. Administrative access is authorized on every request using current profile values. A profile role admin/owner/superadmin or is_admin=true grants access. Unknown/missing/expired sessions return 401, authenticated visitors return 403. Login creates a new random token; only its SHA-256 hash reaches PostgreSQL. Logout revokes the stored session. New deployment requires a fresh login; no Supabase sessions are imported.

API contracts:

- `POST /api/newsletter {name?,email}`: 201 `{ok:true}`; duplicate email 409 `{error,message,code:"EMAIL_EXISTS"}`. Case-insensitive uniqueness is enforced; source import must verify case variants before insertion.
- `POST /api/contact {name,message,email?,phone?,company?}`: 201 `{ok:true}`. Name, message and at least one of email/phone are required (400 with code `CONTACT_REQUIRED` or `CONTACT_REACH_REQUIRED`). Limited to 5 per hour per client IP. Messages are stored in `contact_messages` (the runtime role can only insert) and sent to Telegram when configured.
- `POST /api/auth/login {email,password}`: 200 `{user:{id,email,role,is_admin}}` and session cookie; invalid credentials 401.
- `GET /api/auth/session`: same user envelope or 401.
- `POST /api/auth/logout`: 204 and cleared session cookie. A JSON body is unnecessary, but Origin is mandatory.
- `GET /api/admin/interactions`: `{interactions:[...]}`, sorted newest first. Frontend polls every 5 seconds.
- `PATCH /api/admin/sessions/:id/read`: marks that session's rows read and returns `{ok:true}`. Body optional; Origin mandatory.
- `GET /api/health`: 200 `{ok:true,database:"ready"}` or 503 `{ok:false,database:"unavailable"}`. No version, credential, row count or user data is disclosed.
- `POST /api/chat {message,sessionId,stream?}`: existing `{output}` response or SSE `delta {delta}`, `done {output}`, `error {error}`. Pre-stream input/quota faults use HTTP 400/429. Provider faults use 502 or timeout 504 for JSON. Once SSE HTTP 200 starts, failures are reported as SSE error because headers cannot change. A success/done response occurs only after the interaction transaction commits.

History and knowledge reads fail closed before paid AI calls. The complete interaction history stays persisted; the provider receives the latest six interaction pairs in chronological order, preserving the existing context behavior. Daily session quota includes today's imported interaction rows plus non-completed reservations; IP quota counts every reservation, including failed requests. Changing the client session ID cannot reset the server IP/day quota. Parallel quota checks are serialized across processes using a short PostgreSQL advisory transaction lock; no transaction is held during AI calls. One concurrent request per session preserves history order. Expired reservations remain counted as attempts for the day. API-IP minute limits, newsletter limits and login-IP/account limits are persisted too. No database connection failure grants AI usage.

New subscribers and their `newsletter_outbox` rows are inserted in one transaction. Every outbox row has a stable UUID event ID. Its `payload` retains the existing webhook INSERT envelope (type/table/schema/record/old_record). Import inserts only source subscribers and creates no outbox rows. Delivery defaults off. When enabled, one worker leases due rows with `SKIP LOCKED`, posts the compatible envelope to the fixed HTTPS n8n webhook with the stable event ID header, and retries failures with capped backoff. Delivery is at least once: n8n must persistently deduplicate the event ID before production delivery is enabled, or a lost HTTP acknowledgement may send the welcome email twice. Existing Telegram behavior remains best-effort and does not block a durably saved chat response.

Run `npm test --prefix apps/portfolio/server --workspaces=false` for meaningful HTTP/security tests without paid generation or messages. To include SQL/concurrency tests, set `TEST_DATABASE_URL` to a disposable PostgreSQL connection allowed to create schemas; the suite creates and drops only its random `portfolio_test_*` schema, never application tables. It verifies duplicate/rollback outbox behavior, imported rows without events, concurrent quota reservations, session-ID bypass prevention, durable chat history and atomic minute limits.

Independent administrator recovery: create a protected file (0600 on Linux) with the new password, set `RESET_PASSWORD_EMAIL` and `RESET_PASSWORD_FILE` plus the privileged `MIGRATION_DATABASE_URL` (and `MIGRATION_OWNER_ROLE` when migrations use it; the runtime role is deliberately read-only on `app_users`), then run `npm run reset-password --prefix apps/portfolio/server --workspaces=false` from the protected operator environment. The command accepts no secret arguments, hashes with bcrypt cost 12, updates only an existing administrator account and revokes all its sessions transactionally. Remove the password file immediately afterward. Passwords must fit bcrypt's 72-byte UTF-8 limit; imports preserve bcrypt hashes unchanged.
