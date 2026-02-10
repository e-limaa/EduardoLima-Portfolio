
  # Landing Page para Portfólio

  This is a code bundle for Landing Page para Portfólio. The original project is available at https://www.figma.com/design/yYCH6pCKDEUpAxl4bmQffH/Landing-Page-para-Portf%C3%B3lio.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Environment Variables

  Client (Vite):

  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

  Server (Vercel Functions):

  - `N8N_WEBHOOK_URL`
  - `N8N_WEBHOOK_SECRET` (optional but recommended)
  - `CHAT_ALLOWED_ORIGINS` (optional, comma-separated allowlist for `/api/chat`; ex: `https://seu-dominio.com,https://preview.vercel.app`)

  Local chat with `npm run dev`:

  - `N8N_WEBHOOK_URL` is also used by Vite dev proxy for `POST /api/chat`
  - Keep this variable only in local `.env` / Vercel server env (do not expose as `VITE_*`)

  ## Dashboard Access Control

  The dashboard route now depends on Supabase Auth and admin role checks.

  - Claims supported: `app_metadata.role` as `admin|owner|superadmin`
  - Source of truth: `profiles` table (`role` + `is_admin`)
  - Optional fallback: JWT role claim (`app_metadata.role`)

  Apply RLS script before production:

  - `supabase/rls/interaction_logs.sql` (creates `profiles`, trigger, helper function and RLS)
  
