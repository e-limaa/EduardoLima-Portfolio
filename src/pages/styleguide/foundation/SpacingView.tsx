import React from 'react';
import primitives from '@design-system/tokens/primitives.json';

const SpacingRow = ({ token, value }: { token: string; value: string }) => {
    // Convert rem to pixels for visual scaling estimation (1rem = 16px)
    const pxValue = value.endsWith('rem')
        ? parseFloat(value) * 16
        : value.endsWith('px')
            ? parseFloat(value)
            : 0;

    return (
        <div className="flex items-center gap-8 py-4 border-b border-border hover:bg-muted/50 transition-colors px-4 -mx-4 rounded-lg">
            <div className="w-24 flex-shrink-0">
                <p className="font-mono text-sm font-semibold">{token}</p>
                <p className="font-mono text-xs text-muted-foreground">{value}</p>
                <p className="font-mono text-xs text-muted-foreground opacity-50">{pxValue}px</p>
            </div>

            <div className="flex-1 flex items-center">
                {/* Visual Representation */}
                <div
                    className="h-8 bg-primary/20 border border-primary/40 rounded flex items-center justify-center relative min-w-[2px]"
                    style={{ width: value === '0px' ? '1px' : value }}
                >
                    {/* Show tooltip or value if it fits */}
                    {pxValue > 50 && (
                        <span className="text-[10px] text-primary font-mono">{value}</span>
                    )}
                </div>
            </div>

            <div className="w-1/4 hidden md:block text-xs text-muted-foreground">
                <code>w-{token}</code>, <code>p-{token}</code>, <code>gap-{token}</code>
            </div>
        </div>
    );
};

export const SpacingView = () => {
    // Sort keys numerically/logically: 0, px, 0.5, 1, ... 96
    const sortedKeys = Object.keys(primitives.spacing).sort((a, b) => {
        if (a === 'px') return -0.5;
        if (b === 'px') return 0.5;
        return parseFloat(a) - parseFloat(b);
    });

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-4">Espaçamento</h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    A escala de espaçamento padrão do Tailwind é a base do nosso ritmo vertical e horizontal.
                    Garante consistência em margens, paddings, larguras e alturas.
                </p>
            </div>

            <div className="border rounded-xl border-border bg-card p-8">
                <div className="flex items-center gap-8 pb-4 border-b border-border text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-4">
                    <div className="w-24">Token</div>
                    <div className="flex-1">Visualização</div>
                    <div className="w-1/4 hidden md:block">Classes Exemplo</div>
                </div>

                <div className="space-y-1">
                    {sortedKeys.map((key) => (
                        <SpacingRow key={key} token={key} value={primitives.spacing[key as keyof typeof primitives.spacing]} />
                    ))}
                </div>
            </div>
        </div>
    );
};
