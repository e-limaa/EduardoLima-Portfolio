import React from "react";
import { ArrowLeft, Palette, Type, Box, Layers, Moon, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { useTheme } from "../components/theme-provider";
import semanticTokens from '@design-system/tokens/semantic.json';

const ColorSwatch = ({ name, variable, value }: { name: string; variable: string; value: string }) => (
    <div className="flex flex-col gap-2">
        <div
            className="h-20 w-full rounded-xl border border-border shadow-sm"
            style={{ backgroundColor: `var(${variable})` }}
        >
            {/* Fallback visualizer if var isn't working yet, or just to show the raw color on hover/tooltip */}
        </div>
        <div>
            <p className="text-sm font-medium capitalize">{name.replace('-', ' ')}</p>
            <p className="text-xs text-muted-foreground font-mono">{variable}</p>
            <p className="text-[10px] opacity-50 uppercase font-mono mt-1">{value?.toString()}</p>
        </div>
    </div>
);

const Section = ({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) => (
    <section className="mb-16">
        <div className="flex items-center gap-3 mb-8 border-b border-border pb-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Icon size={20} />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        </div>
        {children}
    </section>
);


export const DesignSystem = () => {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    // Flattening the semantic tokens to match our globals.css variables for visualization
    const coreColors = [
        { name: "Background", variable: "--background", value: semanticTokens.light.background.default },
        { name: "Foreground", variable: "--foreground", value: semanticTokens.light.text.primary },
        { name: "Card", variable: "--card", value: semanticTokens.light.background.surface },
        { name: "Card Foreground", variable: "--card-foreground", value: semanticTokens.light.text.primary },
        { name: "Popover", variable: "--popover", value: semanticTokens.light.background.popover },
        { name: "Primary", variable: "--primary", value: semanticTokens.light.action.primary.background },
        { name: "Primary Foreground", variable: "--primary-foreground", value: semanticTokens.light.action.primary.foreground },
        { name: "Secondary", variable: "--secondary", value: semanticTokens.light.action.secondary.background },
        { name: "Muted", variable: "--muted", value: semanticTokens.light.action.accent.background },
        { name: "Destructive", variable: "--destructive", value: semanticTokens.light.action.destructive.background },
        { name: "Border", variable: "--border", value: semanticTokens.light.border.default },
        { name: "Input", variable: "--input", value: semanticTokens.light.border.input },
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
        <div className="min-h-screen bg-background text-foreground p-8 md:p-16 lg:p-24 transition-colors duration-300">
            {/* Header */}
            <header className="max-w-6xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Voltar para Home
                    </button>
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-4">
                        Design System <span className="text-primary/50">v1.0</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl">
                        Sistema independente, orientado a tokens e acessível.
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="rounded-full w-12 h-12"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </Button>
            </header>

            <main className="max-w-6xl mx-auto">
                {/* Cores */}
                <Section title="Tokens Semânticos (Core)" icon={Palette}>
                    <p className="mb-6 text-muted-foreground">Cores fundamentais mapeadas para variáveis CSS globais.</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {coreColors.map((color) => (
                            <ColorSwatch key={color.variable} {...color} />
                        ))}
                    </div>
                </Section>

                <Section title="Visualização de Dados (Charts)" icon={Layers}>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {chartColors.map((color) => (
                            <ColorSwatch key={color.variable} {...color} />
                        ))}
                    </div>
                </Section>

                {/* Tipografia */}
                <Section title="Tipografia" icon={Type}>
                    <div className="space-y-8 border rounded-xl p-8 border-border">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">H1 / Display</p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight">The quick brown fox</h1>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">H2 / Section</p>
                            <h2 className="text-3xl md:text-4xl font-medium tracking-tight">Jumps over the lazy dog</h2>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">H3 / Subsection</p>
                            <h3 className="text-2xl font-medium">Design Systems are products</h3>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-mono">Body / Paragraph</p>
                            <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
                                A tipografia base é definida em 16px (1rem) com a fonte Inter. O peso padrão é regular (400) para corpo e medium (500) para títulos, garantindo legibilidade e uma estética moderna e limpa.
                            </p>
                        </div>
                    </div>
                </Section>

                {/* Componentes */}
                <Section title="Componentes (shadcn/ui)" icon={Box}>
                    <div className="grid gap-12 p-8 border border-border rounded-xl bg-card">
                        {/* Botões */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-mono">Buttons</h4>
                            <div className="flex flex-wrap gap-4 items-center">
                                <Button variant="default">Primary Action</Button>
                                <Button variant="secondary">Secondary</Button>
                                <Button variant="outline">Outline</Button>
                                <Button variant="ghost">Ghost</Button>
                                <Button variant="destructive">Destructive</Button>
                                <Button variant="link">Link Style</Button>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-mono">Badges</h4>
                            <div className="flex flex-wrap gap-4">
                                <Badge variant="default">Default</Badge>
                                <Badge variant="secondary">Secondary</Badge>
                                <Badge variant="outline">Outline</Badge>
                                <Badge variant="destructive">Destructive</Badge>
                            </div>
                        </div>

                        {/* Layout Cards */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider font-mono">Cards & Surfaces</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                                    <h3 className="font-semibold mb-2">Card Title</h3>
                                    <p className="text-sm text-muted-foreground">Cards utilizam a variável --card para background e --border para bordas sutis.</p>
                                </div>
                                <div className="p-6 rounded-xl bg-muted text-muted-foreground">
                                    <h3 className="font-semibold mb-2">Muted Surface</h3>
                                    <p className="text-sm">Áreas secundárias utilizam --muted para diferenciar visualmente do conteúdo principal.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Section>
            </main>

            {/* Footer */}
            <footer className="max-w-6xl mx-auto mt-32 pt-8 border-t border-border flex justify-between items-center text-xs text-muted-foreground font-mono">
                <p>EduardoLima DS v0.1.0</p>
                <p>Tokens: {JSON.stringify(semanticTokens.light.background.default).substring(0, 10)}... (loaded)</p>
            </footer>
        </div>
    );
};

export default DesignSystem;
