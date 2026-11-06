# Changelog — @limia/tokens

Todas as mudanças relevantes deste pacote. Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versões seguem SemVer (ver `packages/limia-design-system/CONTRIBUTING.md`).

## [Unreleased]

### Added
- `text.danger` (Light `red.700`, Dark `red.400`): cor de texto para erros e ações destrutivas sobre superfícies.
- `radius.xs` (2px) e `radius.2xl` (16px), já usados pelo código via Tailwind.
- `shadow.xs`–`shadow.xl` com os valores do Tailwind v4.
- `typography.lineHeight`, `typography.letterSpacing` e `typography.scaleMobile` (antes só existiam em `globals.css`).
- Build gera `--radius-*`, `--shadow-*`, `--leading-*`, `--tracking-*` e o bloco `@media (max-width: 767px)` da escala mobile.
- `npm run test` (testes de integridade dos tokens com `node:test`).
- `check-contrast.js` cobre texto muted, texto de erro, accent, secondary e a regra de 3:1 para borda de input e anel de foco.

### Changed
- `text.muted` (Light) `zinc.500` → `zinc.600` — contraste sobre `background.muted` subiu de 4,40 para 7,03.
- `border.input` (Light e Dark) → `zinc.500` — contorno de campos atinge 3:1 (WCAG 1.4.11).
- `action.accent.background` (Dark) `brand.500` → `brand.600` — texto sobre accent subiu de 3,68 para 5,17.
