import React from 'react';
import { ArrowRight, Box, Palette, Terminal, Zap } from 'lucide-react';
import { Button } from '@antigravity/ds';
import { Link } from 'react-router-dom';

export const Overview = () => {
    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-bold tracking-tight mb-4">Eduardo Lima Design System</h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
                    Um sistema de design minimalista, token-driven e acessível, construído para escalar.
                    Baseado em React, Tailwind CSS e princípios sólidos de UI.
                </p>
                <div className="flex gap-4 mt-8">
                    <Link to="/design-system/foundation/colors">
                        <Button className="rounded-full gap-2">
                            Explorar Tokens <ArrowRight size={16} />
                        </Button>
                    </Link>
                    <Link to="/design-system/components/buttons">
                        <Button variant="outline" className="rounded-full">
                            Ver Componentes
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                        <Palette size={20} />
                    </div>
                    <h3 className="font-semibold mb-2">Token-Driven</h3>
                    <p className="text-sm text-muted-foreground">
                        Definido em três camadas: Primitives, Semantics e Components.
                        Facilita theming e manutenção.
                    </p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
                        <Zap size={20} />
                    </div>
                    <h3 className="font-semibold mb-2">Modern Stack</h3>
                    <p className="text-sm text-muted-foreground">
                        Construído sobre Tailwind v4, React e shadcn/ui.
                        Performance e Developer Experience em primeiro lugar.
                    </p>
                </div>
                <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 mb-4">
                        <Terminal size={20} />
                    </div>
                    <h3 className="font-semibold mb-2">Independent</h3>
                    <p className="text-sm text-muted-foreground">
                        Estruturado como um pacote <code>@design-system</code> desacoplado
                        da lógica da aplicação principal.
                    </p>
                </div>
            </div>

            <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b border-border flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400/50" />
                        <div className="w-3 h-3 rounded-full bg-green-400/50" />
                    </div>
                    <span className="text-xs text-muted-foreground font-mono ml-2">install.sh</span>
                </div>
                <div className="p-6 bg-black text-zinc-300 font-mono text-sm overflow-x-auto">
                    <p><span className="text-green-400">➜</span> <span className="text-blue-400">~</span> npm install @design-system/core</p>
                    <p className="mt-2 text-zinc-500"># Integrar ao seu projeto React existente</p>
                </div>
            </div>
        </div>
    );
};
