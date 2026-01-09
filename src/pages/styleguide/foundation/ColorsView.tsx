import React from 'react';
import semanticTokens from '@design-system/tokens/semantic.json';
import primitives from '@design-system/tokens/primitives.json';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';

const ColorSwatch = ({ name, variable, value }: { name: string; variable: string; value: string }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(`var(${variable})`);
        // Assuming user has a toast system, or simple alert
        // alert(`Copied: var(${variable})`); 
        // Using console for now if no toast
    };

    return (
        <div className="flex flex-col gap-2 group cursor-pointer" onClick={handleCopy}>
            <div className="relative h-24 w-full rounded-xl border border-border shadow-sm overflow-hidden transition-transform group-hover:scale-[1.02] ring-primary/20 hover:ring-2">
                <div
                    className="absolute inset-0"
                    style={{ backgroundColor: `var(${variable})` }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white">
                    <Copy size={20} />
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium capitalize">{name}</p>
                    {value && <p className="text-[10px] opacity-50 font-mono">{value.includes('color.') ? value : value}</p>}
                </div>
                <p className="text-xs text-muted-foreground font-mono">{variable}</p>
            </div>
        </div>
    );
};

const ColorGroup = ({ title, description, colors }: { title: string; description: string; colors: { name: string; variable: string; value: any }[] }) => (
    <section className="space-y-6">
        <div>
            <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {colors.map((c) => (
                <ColorSwatch key={c.variable} {...c} />
            ))}
        </div>
    </section>
);

export const ColorsView = () => {
    const bgColors = [
        { name: "Default", variable: "--background", value: semanticTokens.light.background.default },
        { name: "Surface (Card)", variable: "--card", value: semanticTokens.light.background.surface },
        { name: "Muted", variable: "--muted", value: semanticTokens.light.background.muted },
        { name: "Popover", variable: "--popover", value: semanticTokens.light.background.popover },
    ];

    const textColors = [
        { name: "Primary", variable: "--foreground", value: semanticTokens.light.text.primary },
        { name: "Secondary", variable: "--muted-foreground", value: semanticTokens.light.text.secondary },
    ];

    const actionColors = [
        { name: "Primary", variable: "--primary", value: semanticTokens.light.action.primary.background },
        { name: "Primary FG", variable: "--primary-foreground", value: semanticTokens.light.action.primary.foreground },
        { name: "Secondary", variable: "--secondary", value: semanticTokens.light.action.secondary.background },
        { name: "Destructive", variable: "--destructive", value: semanticTokens.light.action.destructive.background },
        { name: "Accent", variable: "--accent", value: semanticTokens.light.action.accent.background },
        { name: "Ring", variable: "--ring", value: semanticTokens.light.action.ring },
    ];

    const chartColors = [
        { name: "Chart 1", variable: "--chart-1", value: semanticTokens.light.chart["1"] },
        { name: "Chart 2", variable: "--chart-2", value: semanticTokens.light.chart["2"] },
        { name: "Chart 3", variable: "--chart-3", value: semanticTokens.light.chart["3"] },
        { name: "Chart 4", variable: "--chart-4", value: semanticTokens.light.chart["4"] },
        { name: "Chart 5", variable: "--chart-5", value: semanticTokens.light.chart["5"] },
    ];

    return (
        <div className="space-y-16">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-4">Sistema de Cores</h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Nossa paleta semântica projeta contraste, hierarquia e significado.
                    Tokens semânticos adaptam-se automaticamente a temas claros e escuros.
                </p>
            </div>

            <ColorGroup
                title="Backgrounds"
                description="Cores de superfície aplicadas a containers, cartões e fundo da página."
                colors={bgColors}
            />

            <ColorGroup
                title="Texto"
                description="Cores tipográficas para legibilidade e hierarquia."
                colors={textColors}
            />

            <ColorGroup
                title="Ações e Feedback"
                description="Cores interativas para elementos clicáveis e estados de aviso."
                colors={actionColors}
            />

            <ColorGroup
                title="Data Visualization"
                description="Cores categóricas para gráficos e dashboards."
                colors={chartColors}
            />

            <div className="space-y-8 pt-12 border-t border-border">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">Escalas Primitivas (Ranges)</h2>
                    <p className="text-muted-foreground">O espectro completo das nossas cores base.</p>
                </div>

                <div className="space-y-8">
                    {/* Zinc Scale */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium">Zinc (Neutral)</h3>
                        <div className="grid grid-cols-6 md:grid-cols-11 gap-2">
                            {Object.entries(primitives.color.zinc).map(([shade, value]) => (
                                <div key={shade} className="space-y-1.5">
                                    <div
                                        className="h-12 w-full rounded-md border border-border/50"
                                        style={{ backgroundColor: value as string }}
                                        title={`Zinc ${shade} - ${value}`}
                                    />
                                    <div className="text-center">
                                        <p className="text-xs font-medium">{shade}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{value as React.ReactNode}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Brand Scale */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium">Brand (Blue)</h3>
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(primitives.color.brand).map(([shade, value]) => (
                                <div key={shade} className="space-y-1.5 min-w-[3rem]">
                                    <div
                                        className="h-12 w-full rounded-md border border-border/50"
                                        style={{ backgroundColor: value as string }}
                                    />
                                    <div className="text-center">
                                        <p className="text-xs font-medium">{shade}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">{value as React.ReactNode}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
