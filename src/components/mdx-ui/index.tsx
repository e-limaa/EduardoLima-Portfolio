// --- Exports ---
export * from './DocsPageHeader';
export * from './ComponentPlayground';

// --- Callout ---
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';


// --- Callout ---
type CalloutType = 'info' | 'warning' | 'success' | 'danger';

interface CalloutProps {
    type?: CalloutType;
    title?: string;
    children: React.ReactNode;
}

const CALLOUT_STYLES = {
    info: {
        border: 'border-blue-200 dark:border-blue-900',
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        icon: Info,
        iconColor: 'text-blue-600 dark:text-blue-400',
    },
    warning: {
        border: 'border-yellow-200 dark:border-yellow-900',
        bg: 'bg-yellow-50 dark:bg-yellow-950/30',
        icon: AlertCircle,
        iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    success: {
        border: 'border-green-200 dark:border-green-900',
        bg: 'bg-green-50 dark:bg-green-950/30',
        icon: CheckCircle2,
        iconColor: 'text-green-600 dark:text-green-400',
    },
    danger: {
        border: 'border-red-200 dark:border-red-900',
        bg: 'bg-red-50 dark:bg-red-950/30',
        icon: XCircle,
        iconColor: 'text-red-600 dark:text-red-400',
    },
};

export const Callout = ({ type = 'info', title, children }: CalloutProps) => {
    const style = CALLOUT_STYLES[type];
    const Icon = style.icon;

    return (
        <div className={cn("my-6 flex gap-3 rounded-lg border p-4", style.border, style.bg)}>
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", style.iconColor)} />
            <div className="text-sm [&>p]:leading-relaxed">
                {title && <h5 className="mb-1 font-medium text-foreground">{title}</h5>}
                <div className="text-muted-foreground">{children}</div>
            </div>
        </div>
    );
};

// --- Do / Don't ---
interface DoDontProps {
    type: 'do' | 'dont';
    children: React.ReactNode;
    title?: string;
}

export const DoDont = ({ type, title, children }: DoDontProps) => {
    const isDo = type === 'do';
    return (
        <div className={cn("flex flex-col border-t-4 bg-muted/30 p-4 rounded-md",
            isDo ? "border-green-500" : "border-red-500"
        )}>
            <h4 className={cn("mb-2 flex items-center gap-2 font-bold uppercase tracking-wider text-xs",
                isDo ? "text-green-600" : "text-red-600"
            )}>
                {isDo ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                {title || (isDo ? "Do" : "Don't")}
            </h4>
            <div className="text-sm text-muted-foreground">{children}</div>
        </div>
    );
};

export const DoDontContainer = ({ children }: { children: React.ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">{children}</div>
);

// --- Component Preview ---
export const ComponentPreview = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={cn("my-6 rounded-lg border bg-background p-8 flex items-center justify-center min-h-[160px] preview-container", className)}>
            {children}
        </div>
    );
};

// --- Token Table (Simple) ---
export const TokenTable = ({ tokens }: { tokens: { name: string, value: string, usage: string }[] }) => (
    <div className="my-6 w-full overflow-y-auto">
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b bg-muted/50 text-left">
                    <th className="p-2 font-medium">Token Name</th>
                    <th className="p-2 font-medium">Value</th>
                    <th className="p-2 font-medium">Usage</th>
                </tr>
            </thead>
            <tbody>
                {tokens.map((t) => (
                    <tr key={t.name} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="p-2 font-mono text-xs">{t.name}</td>
                        <td className="p-2 font-mono text-xs text-muted-foreground">{t.value}</td>
                        <td className="p-2 text-muted-foreground">{t.usage}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
