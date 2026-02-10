/**
 * THIS FILE IS AUTO-GENERATED. DO NOT EDIT MANUALY.
 * Source: packages/design-system/tokens/semantic.json
 */

export const tokens = {
    "background.default": "var(--background-default)",
    "background.surface": "var(--background-surface)",
    "background.muted": "var(--background-muted)",
    "background.popover": "var(--background-popover)",
    "background.input": "var(--background-input)",
    "text.primary": "var(--text-primary)",
    "text.secondary": "var(--text-secondary)",
    "text.muted": "var(--text-muted)",
    "text.inverse": "var(--text-inverse)",
    "border.default": "var(--border-default)",
    "border.input": "var(--border-input)",
    "action.primary.background": "var(--action-primary-background)",
    "action.primary.foreground": "var(--action-primary-foreground)",
    "action.primary.hover": "var(--action-primary-hover)",
    "action.secondary.background": "var(--action-secondary-background)",
    "action.secondary.foreground": "var(--action-secondary-foreground)",
    "action.destructive.background": "var(--action-destructive-background)",
    "action.destructive.foreground": "var(--action-destructive-foreground)",
    "action.accent.background": "var(--action-accent-background)",
    "action.accent.foreground": "var(--action-accent-foreground)",
    "action.ring": "var(--action-ring)",
    "chart.1": "var(--chart-1)",
    "chart.2": "var(--chart-2)",
    "chart.3": "var(--chart-3)",
    "chart.4": "var(--chart-4)",
    "chart.5": "var(--chart-5)",
    "sidebar.background": "var(--sidebar-background)",
    "sidebar.foreground": "var(--sidebar-foreground)",
    "sidebar.primary": "var(--sidebar-primary)",
    "sidebar.primary-foreground": "var(--sidebar-primary-foreground)",
    "sidebar.accent": "var(--sidebar-accent)",
    "sidebar.accent-foreground": "var(--sidebar-accent-foreground)",
    "sidebar.border": "var(--sidebar-border)",
    "sidebar.ring": "var(--sidebar-ring)"
} as const;

export type TokenPath = keyof typeof tokens;

// Domain Specific Types
export type ColorTokenPath = Extract<TokenPath, `${'background' | 'text' | 'border' | 'action' | 'chart'}${string}`>;
// Add Radius/Spacing if they exist in semantic
