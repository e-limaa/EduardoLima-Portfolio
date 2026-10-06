FROM node:22-bookworm-slim AS studio-build

WORKDIR /workspace/studio
COPY studio/package.json studio/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY studio/ ./
RUN npm run build

FROM node:22-bookworm-slim AS runtime

WORKDIR /app
COPY --from=studio-build --chown=node:node /workspace/studio/dist ./dist
COPY --chown=node:node studio/serve-studio.cjs ./serve-studio.cjs

USER node
EXPOSE 3333
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3333/').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "serve-studio.cjs", "/app/dist", "3333"]
