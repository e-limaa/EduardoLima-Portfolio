import React from 'react';
import { Radius } from 'lucide-react';

const RadiusCard = ({ token, value, variable, className }: { token: string, value: string, variable: string, className?: string }) => (
    <div className="flex flex-col gap-4 p-6 border border-border rounded-xl bg-card">
        <div className="flex items-center justify-between">
            <code className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">{token}</code>
            <span className="text-xs text-muted-foreground font-mono">{value}</span>
        </div>

        <div className="flex items-center justify-center p-8 bg-muted/50 rounded-lg border border-dashed border-border">
            <div className={`w-24 h-24 bg-primary shadow-sm ${className} flex items-center justify-center`}>
                <span className="text-primary-foreground text-xs opacity-80">Box</span>
            </div>
        </div>

        <div className="pt-2 border-t border-border mt-auto">
            <code className="text-[10px] text-muted-foreground">{variable}</code>
        </div>
    </div>
);

export const RadiusView = () => {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-4 flex items-center gap-3">
                    <Radius className="w-8 h-8 opacity-80" />
                    Radius
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl">
                    Tokens de arredondamento para suavizar a interface. O sistema utiliza um valor base que escala automaticamente.
                </p>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-500 max-w-2xl">
                    <strong>Nota:</strong> O valor base de <code>--radius</code> é 0.625rem (10px). Todos os outros valores são calculados a partir dele.
                </div>
            </div>

            <div className="grid gap-8">
                <h2 className="text-xl font-semibold border-b border-border pb-2">Tokens Disponíveis</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <RadiusCard
                        token="rounded-sm"
                        value="~6px (radius - 4px)"
                        variable="var(--radius-sm)"
                        className="rounded-sm"
                    />

                    <RadiusCard
                        token="rounded-md"
                        value="~8px (radius - 2px)"
                        variable="var(--radius-md)"
                        className="rounded-md"
                    />

                    <RadiusCard
                        token="rounded-lg"
                        value="10px (Base)"
                        variable="var(--radius-lg)"
                        className="rounded-lg border-2 border-primary ring-4 ring-primary/20"
                    />

                    <RadiusCard
                        token="rounded-xl"
                        value="~14px (radius + 4px)"
                        variable="var(--radius-xl)"
                        className="rounded-xl"
                    />

                    <RadiusCard
                        token="rounded-full"
                        value="9999px"
                        variable="N/A"
                        className="rounded-full"
                    />

                    <RadiusCard
                        token="rounded-none"
                        value="0px"
                        variable="N/A"
                        className="rounded-none"
                    />
                </div>
            </div>

            <section className="space-y-6">
                <h2 className="text-xl font-semibold border-b border-border pb-2">Exemplos de Uso</h2>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase">Botões (rounded-md / lg)</h3>
                        <div className="flex gap-4">
                            <button className="h-10 px-4 bg-primary text-primary-foreground rounded-lg font-medium text-sm">
                                Primary Action (lg)
                            </button>
                            <button className="h-10 px-4 border border-input bg-background hover:bg-accent rounded-md text-sm">
                                Secondary (md)
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase">Inputs e Cards (rounded-xl)</h3>
                        <div className="p-4 border border-border rounded-xl bg-card w-full max-w-sm">
                            <label className="text-xs font-medium mb-1.5 block">Email Address</label>
                            <input type="text" className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" placeholder="Enter email..." />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
