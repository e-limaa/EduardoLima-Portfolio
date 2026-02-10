# 🔗 Mapa de Aliases — Semantic → Primitives

Após importar os JSONs no Figma, use esta tabela para criar os aliases manualmente.
Para cada variável semântica, clique nela no Figma → troque o valor para **"Alias"** → selecione o primitivo indicado.

> **Dica**: No Figma, a descrição de cada variável semântica já contém o alias (ex: `Alias → color/zinc/100`).

## Como importar

1. Importe `limex-figma-primitives.json` → cria collection **Primitives**
2. Importe `limex-figma-semantic-light.json` → cria collection **Semantic** (modo Light)
3. Importe `limex-figma-semantic-dark.json` → **na mesma collection Semantic** → cria modo **Dark** como coluna

## Background

| Variável Semântica | Light → Primitivo | Dark → Primitivo |
|---|---|---|
| `background/default` | `color/zinc/100` | `color/black` |
| `background/surface` | `color/white` | `color/zinc/950` |
| `background/muted` | `color/zinc/100` | `color/zinc/900` |
| `background/popover` | `color/white` | `color/zinc/950` |
| `background/input` | `color/zinc/200` | `color/zinc/800` |

## Text

| Variável Semântica | Light → Primitivo | Dark → Primitivo |
|---|---|---|
| `text/primary` | `color/zinc/900` | `color/zinc/50` |
| `text/secondary` | `color/zinc/700` | `color/zinc/300` |
| `text/muted` | `color/zinc/500` | `color/zinc/400` |
| `text/inverse` | `color/white` | `color/zinc/900` |

## Border

| Variável Semântica | Light → Primitivo | Dark → Primitivo |
|---|---|---|
| `border/default` | `color/zinc/200` | `color/zinc/800` |
| `border/input` | `color/zinc/200` | `color/zinc/800` |

## Action

| Variável Semântica | Light → Primitivo | Dark → Primitivo |
|---|---|---|
| `action/primary/background` | `color/brand/600` | `color/brand/600` |
| `action/primary/foreground` | `color/white` | `color/white` |
| `action/primary/hover` | `color/brand/500` | `color/brand/500` |
| `action/secondary/background` | `color/zinc/200` | `color/zinc/800` |
| `action/secondary/foreground` | `color/zinc/900` | `color/zinc/50` |
| `action/destructive/background` | `color/red/500` | `color/red/900` |
| `action/destructive/foreground` | `color/zinc/50` | `color/zinc/50` |
| `action/accent/background` | `color/brand/600` | `color/brand/500` |
| `action/accent/foreground` | `color/white` | `color/white` |
| `action/ring` | `color/brand/600` | `color/brand/600` |

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
| `sidebar/background` | `color/zinc/100` | `color/zinc/950` |
| `sidebar/foreground` | `color/zinc/900` | `color/zinc/50` |
| `sidebar/primary` | `color/zinc/900` | `color/zinc/50` |
| `sidebar/primary-foreground` | `color/zinc/100` | `color/zinc/950` |
| `sidebar/accent` | `color/zinc/100` | `color/zinc/800` |
| `sidebar/accent-foreground` | `color/zinc/900` | `color/zinc/50` |
| `sidebar/border` | `color/zinc/200` | `color/zinc/800` |
| `sidebar/ring` | `color/zinc/700` | `color/zinc/300` |

