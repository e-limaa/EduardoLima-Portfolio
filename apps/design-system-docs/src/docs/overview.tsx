import { ArrowRight, Palette, Terminal, Zap } from "lucide-react";
import { Button } from "@limia/design-system";

export function DesignSystemOverview() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="mb-4 text-4xl font-bold tracking-tight">
          Limia Design System
        </h1>
        <p className="max-w-3xl text-xl leading-relaxed text-muted-foreground">
          Um sistema de design minimalista, token-driven e acessível,
          construído para escalar. Baseado em React, Tailwind CSS e
          princípios sólidos de UI.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild className="gap-2 rounded-full">
            <a href="/design-system/foundation/colors">
              Explorar Tokens <ArrowRight size={16} />
            </a>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <a href="/design-system/components/buttons">Ver Componentes</a>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Palette size={20} />
          </div>
          <h3 className="mb-2 font-semibold">Token-Driven</h3>
          <p className="text-sm text-muted-foreground">
            Definido em três camadas: Primitives, Semantics e Components.
            Facilita theming e manutenção.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <Zap size={20} />
          </div>
          <h3 className="mb-2 font-semibold">Modern Stack</h3>
          <p className="text-sm text-muted-foreground">
            Construído sobre Tailwind v4, React e shadcn/ui. Performance e
            Developer Experience em primeiro lugar.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
            <Terminal size={20} />
          </div>
          <h3 className="mb-2 font-semibold">Independent</h3>
          <p className="text-sm text-muted-foreground">
            Estruturado como os pacotes <code>@limia/design-system</code> e{" "}
            <code>@limia/tokens</code>, desacoplados de qualquer app host.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="flex items-center gap-2 border-b border-border bg-muted px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400/50" />
            <div className="h-3 w-3 rounded-full bg-yellow-400/50" />
            <div className="h-3 w-3 rounded-full bg-green-400/50" />
          </div>
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            install.sh
          </span>
        </div>
        <div className="overflow-x-auto bg-black p-6 font-mono text-sm text-zinc-300">
          <p>
            <span className="text-green-400">➜</span>{" "}
            <span className="text-blue-400">~</span> npm install @limia/design-system @limia/tokens
          </p>
          <p className="mt-2 text-zinc-500">
            # Integrar ao seu projeto React existente
          </p>
        </div>
      </div>
    </div>
  );
}
