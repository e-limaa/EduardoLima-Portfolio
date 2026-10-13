FROM node:22-bookworm-slim AS web-build

ARG VITE_POSTHOG_KEY=
ARG VITE_POSTHOG_HOST=
ARG VITE_WHATSAPP_NUMBER=
ARG VITE_LINKEDIN_URL=
ARG VITE_GITHUB_URL=
ARG VITE_INSTAGRAM_URL=
ARG VITE_TWITTER_URL=

WORKDIR /workspace
COPY . .
RUN npm ci --no-audit --no-fund
RUN VITE_POSTHOG_KEY="$VITE_POSTHOG_KEY" VITE_POSTHOG_HOST="$VITE_POSTHOG_HOST" VITE_WHATSAPP_NUMBER="$VITE_WHATSAPP_NUMBER" VITE_LINKEDIN_URL="$VITE_LINKEDIN_URL" VITE_GITHUB_URL="$VITE_GITHUB_URL" VITE_INSTAGRAM_URL="$VITE_INSTAGRAM_URL" VITE_TWITTER_URL="$VITE_TWITTER_URL" npm run build --workspace @limia/portfolio

FROM node:22-bookworm-slim AS server-deps

WORKDIR /app/apps/portfolio/server
COPY apps/portfolio/server/package.json apps/portfolio/server/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund

FROM node:22-bookworm-slim AS runtime

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    STATIC_DIR=/app/apps/portfolio/dist

WORKDIR /app
COPY --chown=node:node apps/portfolio/server/ ./apps/portfolio/server/
COPY --from=server-deps --chown=node:node /app/apps/portfolio/server/node_modules ./apps/portfolio/server/node_modules
COPY --from=web-build --chown=node:node /workspace/apps/portfolio/dist ./apps/portfolio/dist
COPY --chown=node:node scripts/portfolio/import-postgres.mjs ./scripts/portfolio/import-postgres.mjs

USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["npm", "start", "--prefix", "apps/portfolio/server"]
