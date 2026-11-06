# Changelog — @limia/design-system

Todas as mudanças relevantes deste pacote. Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/); versões seguem SemVer (ver `CONTRIBUTING.md`).

## [Unreleased]

### Added
- Utilitário `text-danger-text` (mapeia `--text-danger`) para texto de erro.
- Templates Code Connect em `figma/*.figma.ts` + `figma.config.json` (publicação pendente da biblioteca Figma).

### Changed
- Alert destructive, `FormLabel`/`FormMessage` com erro e itens `destructive` de Dropdown Menu, Context Menu e Menubar usam `text-danger-text` em vez de `text-destructive` (que falhava contraste no Dark: 1,99:1).
- `globals.css`: raios, line-height/letter-spacing das utilities `.text-*` e escala mobile passam a vir dos tokens gerados; removidas as definições manuais duplicadas.

### Fixed
- Borda de estado inválido (`aria-invalid`) em Input, Textarea, Select, Checkbox, Radio Group, Toggle, Input OTP, Badge e Button usa `border-danger-text`: no Dark a borda `destructive` ficava em 1,99:1, abaixo do mínimo de 3:1 para contorno de controles.
- `lucide-react` declarado em `dependencies` (já era importado por vários componentes e só funcionava porque os apps o instalavam).
- `--input-background` e `--switch-background` eram usados mas nunca definidos. Agora: input transparente (comportamento que o site já tinha) e trilho do Switch desligado em `--input`.
