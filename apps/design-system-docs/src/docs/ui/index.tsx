// --- Exports ---
export * from './DocsPageHeader';
export * from './DocsPageHero';
export * from './DocsSectionNav';
export * from './DocsMetaRail';
export * from './DocsSection';
export * from './DocsResources';
export * from './DocsRelatedLinks';
export * from './DocsGeneratedChapters';
export * from './DocStatusBadge';
export * from './ComponentPlayground';
export * from './TypographyDemo';

// --- Callout ---
import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { Badge, cn } from '@limia/design-system';


// --- Callout ---
type CalloutType = 'info' | 'warning' | 'success' | 'danger';

interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: ReactNode;
}

const CALLOUT_STYLES = {
    info: {
        border: 'border-primary/20',
        bg: 'bg-primary/5',
        icon: Info,
        iconColor: 'text-primary',
        iconBg: 'bg-primary/10',
        label: 'Info',
    },
    warning: {
        border: 'border-border',
        bg: 'bg-secondary/70',
        icon: AlertCircle,
        iconColor: 'text-foreground',
        iconBg: 'bg-background/80',
        label: 'Warning',
    },
    success: {
        border: 'border-primary/20',
        bg: 'bg-primary/5',
        icon: CheckCircle2,
        iconColor: 'text-primary',
        iconBg: 'bg-primary/10',
        label: 'Success',
    },
    danger: {
        border: 'border-destructive/20',
        bg: 'bg-destructive/10',
        icon: XCircle,
        iconColor: 'text-destructive',
        iconBg: 'bg-destructive/15',
        label: 'Danger',
    },
};

export const Callout = ({ type = 'info', title, children }: CalloutProps) => {
    const style = CALLOUT_STYLES[type];
    const Icon = style.icon;

    return (
        <div className={cn("my-6 flex gap-3 rounded-xl border p-4 shadow-sm", style.border, style.bg)}>
            <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full", style.iconBg)}>
                <Icon className={cn("h-5 w-5", style.iconColor)} />
            </div>
            <div className="space-y-2 text-sm [&>p]:leading-relaxed">
                <Badge variant={type === 'danger' ? 'destructive' : type === 'warning' ? 'secondary' : 'outline'}>
                    {style.label}
                </Badge>
                {title && <h5 className="font-medium text-foreground">{title}</h5>}
                <div className="text-muted-foreground">{children}</div>
            </div>
        </div>
    );
};

// --- Do / Don't ---
interface DoDontProps {
    type: 'do' | 'dont';
    children: ReactNode;
    title?: string;
}

export const DoDont = ({ type, title, children }: DoDontProps) => {
    const isDo = type === 'do';
    return (
        <div className={cn("flex flex-col rounded-xl border bg-card/70 p-4 shadow-sm",
            isDo ? "border-primary/20" : "border-destructive/20"
        )}>
            <div className="mb-3 flex items-center gap-2">
                <div
                    className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full",
                        isDo ? "bg-primary/10 text-primary" : "bg-destructive/15 text-destructive",
                    )}
                >
                    {isDo ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                </div>
                <div className="space-y-1">
                    <Badge variant={isDo ? "outline" : "destructive"}>
                        {isDo ? "Do" : "Don't"}
                    </Badge>
                    <h4 className={cn("font-bold uppercase tracking-wider text-xs",
                        isDo ? "text-primary" : "text-destructive"
                    )}>
                        {title || (isDo ? "Do" : "Don't")}
                    </h4>
                </div>
            </div>
            <div className="text-sm text-muted-foreground">{children}</div>
        </div>
    );
};

export const DoDontContainer = ({ children }: { children: ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">{children}</div>
);

// --- Component Preview ---
export const ComponentPreview = ({ children, className }: { children: ReactNode, className?: string }) => {
    return (
        <div className={cn("preview-container my-6 flex min-h-[160px] items-center justify-center rounded-xl border border-border bg-card/40 p-8", className)}>
            {children}
        </div>
    );
};

// --- Token Table (Simple) ---
export const TokenTable = ({ tokens }: { tokens: { name: string, value: string, usage: string }[] }) => (
    <div className="my-6 w-full overflow-y-auto rounded-xl border border-border">
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-border bg-muted/50 text-left">
                    <th className="p-2 font-medium">Token Name</th>
                    <th className="p-2 font-medium">Value</th>
                    <th className="p-2 font-medium">Usage</th>
                </tr>
            </thead>
            <tbody>
                {tokens.map((t) => (
                    <tr key={t.name} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="p-2 font-mono text-xs">{t.name}</td>
                        <td className="p-2 font-mono text-xs text-muted-foreground">{t.value}</td>
                        <td className="p-2 text-muted-foreground">{t.usage}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
