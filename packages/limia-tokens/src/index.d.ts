/**
 * THIS FILE IS AUTO-GENERATED. DO NOT EDIT MANUALLY.
 * Source: packages/limia-tokens/tokens/semantic.json
 */
export declare const tokens: {
    readonly "background.default": "var(--background-default)";
    readonly "background.surface": "var(--background-surface)";
    readonly "background.muted": "var(--background-muted)";
    readonly "background.popover": "var(--background-popover)";
    readonly "background.input": "var(--background-input)";
    readonly "text.primary": "var(--text-primary)";
    readonly "text.secondary": "var(--text-secondary)";
    readonly "text.muted": "var(--text-muted)";
    readonly "text.inverse": "var(--text-inverse)";
    readonly "border.default": "var(--border-default)";
    readonly "border.input": "var(--border-input)";
    readonly "action.primary.background": "var(--action-primary-background)";
    readonly "action.primary.foreground": "var(--action-primary-foreground)";
    readonly "action.primary.hover": "var(--action-primary-hover)";
    readonly "action.secondary.background": "var(--action-secondary-background)";
    readonly "action.secondary.foreground": "var(--action-secondary-foreground)";
    readonly "action.destructive.background": "var(--action-destructive-background)";
    readonly "action.destructive.foreground": "var(--action-destructive-foreground)";
    readonly "action.accent.background": "var(--action-accent-background)";
    readonly "action.accent.foreground": "var(--action-accent-foreground)";
    readonly "action.ring": "var(--action-ring)";
    readonly "chart.1": "var(--chart-1)";
    readonly "chart.2": "var(--chart-2)";
    readonly "chart.3": "var(--chart-3)";
    readonly "chart.4": "var(--chart-4)";
    readonly "chart.5": "var(--chart-5)";
    readonly "sidebar.background": "var(--sidebar-background)";
    readonly "sidebar.foreground": "var(--sidebar-foreground)";
    readonly "sidebar.primary": "var(--sidebar-primary)";
    readonly "sidebar.primary-foreground": "var(--sidebar-primary-foreground)";
    readonly "sidebar.accent": "var(--sidebar-accent)";
    readonly "sidebar.accent-foreground": "var(--sidebar-accent-foreground)";
    readonly "sidebar.border": "var(--sidebar-border)";
    readonly "sidebar.ring": "var(--sidebar-ring)";
};
export type TokenPath = keyof typeof tokens;
export type ColorTokenPath = Extract<TokenPath, `${'background' | 'text' | 'border' | 'action' | 'chart' | 'sidebar'}${string}`>;
