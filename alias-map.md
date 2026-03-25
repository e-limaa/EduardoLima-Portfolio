# 🔗 Mapa de Aliases — Semantic → Primitives

Após importar os JSONs no Figma, use esta tabela para criar os aliases manualmente.
Para cada variável semântica, clique nela no Figma → troque o valor para **"Alias"** → selecione o primitivo indicado.

> **Dica**: No Figma, a descrição de cada variável semântica já contém o alias (ex: `Alias -> color/zinc/100`).

## Como importar

1. Importe `limia-figma-primitives.json` → cria collection **Primitives**
2. Importe `limia-figma-semantic-light.json` → cria collection **Semantic** (modo Light)
3. Importe `limia-figma-semantic-dark.json` → **na mesma collection Semantic** → cria modo **Dark** como coluna

## Action

| Variável Semântica | Light → Primitivo | Dark → Primitivo |
|---|---|---|
| `action/accent/background` | `color/brand/600` | `color/brand/500` |
| `action/accent/foreground` | `color/white` | `color/white` |
| `action/destructive/background` | `color/red/600` | `color/red/900` |
| `action/destructive/foreground` | `color/zinc/50` | `color/zinc/50` |
| `action/primary/active` | `color/brand/700` | `color/brand/700` |
| `action/primary/background` | `color/brand/600` | `color/brand/600` |
| `action/primary/foreground` | `color/white` | `color/white` |
| `action/primary/hover` | `color/brand/500` | `color/brand/500` |
| `action/ring` | `color/brand/600` | `color/brand/600` |
| `action/secondary/background` | `color/zinc/200` | `color/zinc/800` |
| `action/secondary/foreground` | `color/zinc/900` | `color/zinc/50` |

## Background

| Variável Semântica | Light → Primitivo | Dark → Primitivo |
|---|---|---|
| `background/default` | `color/zinc/100` | `color/black` |
| `background/input` | `color/zinc/200` | `color/zinc/800` |
| `background/inverse` | `color/zinc/900` | `color/zinc/50` |
| `background/layer-1` | `color/white` | `color/zinc/950` |
| `background/layer-2` | `color/zinc/100` | `color/zinc/900` |
| `background/layer-3` | `color/white` | `color/zinc/800` |
| `background/muted` | `color/zinc/100` | `color/zinc/900` |
| `background/popover` | `color/white` | `color/zinc/950` |
| `background/surface` | `color/white` | `color/zinc/950` |

## Border

| Variável Semântica | Light → Primitivo | Dark → Primitivo |
|---|---|---|
| `border/default` | `color/zinc/200` | `color/zinc/800` |
| `border/input` | `color/zinc/200` | `color/zinc/800` |
| `border/inverse` | `color/zinc/700` | `color/zinc/200` |
| `border/strong` | `color/zinc/300` | `color/zinc/700` |
| `border/subtle` | `color/zinc/100` | `color/zinc/900` |

## Chart

| Variável Semântica | Light → Primitivo | Dark → Primitivo |
|---|---|---|
| `chart/1` | `color/chart/1` | `color/chart/dark_1` |
| `chart/2` | `color/chart/2` | `color/chart/dark_2` |
| `chart/3` | `color/chart/3` | `color/chart/dark_3` |
| `chart/4` | `color/chart/4` | `color/chart/dark_4` |
| `chart/5` | `color/chart/5` | `color/chart/dark_5` |

## Sidebar

| Variável Semântica | Light → Primitivo | Dark → Primitivo |
|---|---|---|
| `sidebar/accent` | `color/zinc/100` | `color/zinc/800` |
| `sidebar/accent-foreground` | `color/zinc/900` | `color/zinc/50` |
| `sidebar/background` | `color/zinc/100` | `color/zinc/950` |
| `sidebar/border` | `color/zinc/200` | `color/zinc/800` |
| `sidebar/foreground` | `color/zinc/900` | `color/zinc/50` |
| `sidebar/primary` | `color/zinc/900` | `color/zinc/50` |
| `sidebar/primary-foreground` | `color/zinc/100` | `color/zinc/950` |
| `sidebar/ring` | `color/zinc/700` | `color/zinc/300` |

## Support

| Variável Semântica | Light → Primitivo | Dark → Primitivo |
|---|---|---|
| `support/danger/background` | `color/red/600` | `color/red/700` |
| `support/danger/border` | `color/red/200` | `color/red/800` |
| `support/danger/foreground` | `color/white` | `color/white` |
| `support/danger/subtle` | `color/red/50` | `color/red/950` |
| `support/danger/subtle-foreground` | `color/red/900` | `color/red/100` |
| `support/info/background` | `color/brand/600` | `color/brand/700` |
| `support/info/border` | `color/brand/200` | `color/brand/800` |
| `support/info/foreground` | `color/white` | `color/white` |
| `support/info/subtle` | `color/brand/50` | `color/brand/950` |
| `support/info/subtle-foreground` | `color/brand/900` | `color/brand/100` |
| `support/success/background` | `color/emerald/700` | `color/emerald/700` |
| `support/success/border` | `color/emerald/200` | `color/emerald/800` |
| `support/success/foreground` | `color/white` | `color/white` |
| `support/success/subtle` | `color/emerald/50` | `color/emerald/950` |
| `support/success/subtle-foreground` | `color/emerald/900` | `color/emerald/100` |
| `support/warning/background` | `color/amber/500` | `color/amber/400` |
| `support/warning/border` | `color/amber/200` | `color/amber/800` |
| `support/warning/foreground` | `color/zinc/950` | `color/zinc/950` |
| `support/warning/subtle` | `color/amber/50` | `color/amber/950` |
| `support/warning/subtle-foreground` | `color/amber/900` | `color/amber/100` |

## Text

| Variável Semântica | Light → Primitivo | Dark → Primitivo |
|---|---|---|
| `text/inverse` | `color/white` | `color/zinc/900` |
| `text/muted` | `color/zinc/500` | `color/zinc/400` |
| `text/on-color` | `color/white` | `color/white` |
| `text/on-color-subtle` | `color/zinc/900` | `color/zinc/50` |
| `text/primary` | `color/zinc/900` | `color/zinc/50` |
| `text/secondary` | `color/zinc/700` | `color/zinc/300` |

