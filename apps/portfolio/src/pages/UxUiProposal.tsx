import {
  ArrowUp,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  Layers3,
  Printer,
  Sparkles,
} from "lucide-react";
import { Button } from "@limia/design-system";

const scope = [
  "UX e UI Design para produtos e experiências digitais",
  "Landing pages e páginas estratégicas para campanhas",
  "Mapeamento e evolução de jornadas, fluxos e arquitetura da informação",
  "Wireframes, interfaces e protótipos navegáveis no Figma",
  "Evolução e documentação do design system",
  "Handoff, validação visual e apoio próximo ao time de desenvolvimento",
];

const waysOfWorking = [
  {
    title: "Dedicação recorrente",
    description:
      "Até 2 horas por dia útil, com organização semanal de prioridades junto ao time.",
    icon: Clock3,
  },
  {
    title: "Atuação integrada",
    description:
      "Participação em alinhamentos e execução contínua das demandas dentro do escopo.",
    icon: Layers3,
  },
  {
    title: "Disponibilidade combinada",
    description:
      "Atendimento remoto em período previamente acordado, preservando previsibilidade para ambos.",
    icon: CalendarDays,
  },
];

const terms = [
  ["Modelo", "Prestação de serviços recorrente"],
  ["Dedicação", "Até 40 horas por mês"],
  ["Formato", "Remoto, em dias úteis"],
  ["Faturamento", "Mensal, mediante emissão de nota fiscal"],
  ["Horas adicionais", "Somente mediante alinhamento e aprovação prévia"],
  ["Validade da proposta", "15 dias"],
];

export function UxUiProposal() {
  const issuedAt = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div id="top" className="proposal-page min-h-screen bg-background text-foreground">
      <a
        href="#proposal-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-3 focus:text-primary-foreground"
      >
        Ir para o conteúdo da proposta
      </a>
      <div className="pointer-events-none fixed inset-0 overflow-hidden print:hidden">
        <div className="absolute left-1/2 top-[-18rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]" />
        <div className="proposal-grid absolute inset-0 opacity-35" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <a
          href="/"
          className="inline-flex min-h-10 items-center gap-3 rounded-full px-1 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Voltar ao portfólio de Eduardo Lima"
        >
          <span className="grid size-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-[0_0_20px_color-mix(in_srgb,var(--action-primary-background)_42%,transparent)]">
            EL
          </span>
          <span>Eduardo Lima</span>
        </a>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="print:hidden"
          onClick={() => window.print()}
        >
          <Printer aria-hidden="true" />
          Salvar em PDF
        </Button>
      </header>

      <main
        id="proposal-content"
        className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8 lg:px-12"
      >
        <section className="grid min-h-[72vh] items-end gap-12 border-b border-border/70 py-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,.75fr)] lg:py-24">
          <div>
            <div className="mb-8 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <span className="rounded-full border border-border bg-card/70 px-3 py-2">
                Proposta comercial
              </span>
              <span>UX/UI Design · 2026</span>
            </div>

            <h1 className="max-w-4xl text-balance text-5xl font-bold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Design sênior,
              <span className="block text-primary">presente no dia a dia.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground sm:text-xl">
              Uma parceria recorrente para transformar demandas de produto,
              experiência e interface em entregas claras, consistentes e prontas
              para evoluir com o time.
            </p>
          </div>

          <div className="rounded-[calc(var(--radius-xl)+0.5rem)] border border-primary/30 bg-card/90 p-2 shadow-[0_24px_80px_-32px_color-mix(in_srgb,var(--action-primary-background)_54%,transparent)] backdrop-blur">
            <div className="rounded-xl bg-primary p-6 text-primary-foreground sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  Fee mensal
                </span>
                <Sparkles className="size-5" aria-hidden="true" />
              </div>
              <p className="mt-10 font-mono text-sm text-white/75">R$</p>
              <p className="mt-1 text-5xl font-semibold tracking-[-0.06em] tabular-nums sm:text-6xl">
                8.800
              </p>
              <p className="mt-5 max-w-xs text-sm leading-6 text-white/80">
                Para uma dedicação recorrente de até 2 horas por dia útil,
                aproximadamente 40 horas por mês.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-10 border-b border-border/70 py-20 lg:grid-cols-[.65fr_1.35fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              01 · Modelo de parceria
            </p>
            <h2 className="mt-5 max-w-md text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Continuidade para fazer o trabalho avançar.
            </h2>
          </div>

          <div className="grid gap-4">
            {waysOfWorking.map(({ title, description, icon: Icon }, index) => (
              <article
                key={title}
                className="group grid gap-5 rounded-xl border border-border/70 bg-card/65 p-6 shadow-[0_16px_40px_-32px_rgb(0_0_0/.75)] transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-card sm:grid-cols-[3rem_1fr_auto]"
              >
                <span className="grid size-12 place-items-center rounded-lg bg-secondary text-foreground">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="mt-2 max-w-xl text-pretty leading-7 text-muted-foreground">
                    {description}
                  </p>
                </div>
                <span className="self-start font-mono text-xs text-muted-foreground">
                  0{index + 1}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 border-b border-border/70 py-20 lg:grid-cols-[.65fr_1.35fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              02 · Escopo
            </p>
            <h2 className="mt-5 max-w-md text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Da definição à entrega.
            </h2>
            <p className="mt-5 max-w-sm text-pretty leading-7 text-muted-foreground">
              Priorização flexível, de acordo com as necessidades do negócio e a
              capacidade mensal contratada.
            </p>
          </div>

          <div className="divide-y divide-border/70 border-y border-border/70">
            {scope.map((item, index) => (
              <div
                key={item}
                className="grid grid-cols-[2rem_1fr_auto] items-start gap-3 py-5"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-pretty font-medium leading-7">{item}</p>
                <Check className="mt-1 size-4 text-primary" aria-hidden="true" />
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-10 border-b border-border/70 py-20 lg:grid-cols-[.65fr_1.35fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              03 · Condições comerciais
            </p>
            <h2 className="mt-5 max-w-md text-balance text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Um acordo simples e previsível.
            </h2>
          </div>

          <dl className="overflow-hidden rounded-xl border border-border/70 bg-card/65">
            {terms.map(([label, value]) => (
              <div
                key={label}
                className="grid gap-2 border-b border-border/70 px-5 py-5 last:border-b-0 sm:grid-cols-[12rem_1fr] sm:items-center sm:px-6"
              >
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="py-20">
          <div className="overflow-hidden rounded-[calc(var(--radius-xl)+0.75rem)] border border-border/70 bg-card">
            <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.25fr_.75fr] lg:p-14">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  <span className="size-2 rounded-full bg-primary shadow-[0_0_14px_var(--action-primary-background)]" />
                  Próximo passo
                </span>
                <h2 className="mt-6 max-w-xl text-balance text-3xl font-bold tracking-[-0.035em] sm:text-5xl">
                  Vamos construir essa parceria?
                </h2>
                <p className="mt-5 max-w-xl text-pretty leading-7 text-muted-foreground">
                  Com a aprovação, alinhamos data de início, janela de
                  disponibilidade e prioridades para o primeiro ciclo de trabalho.
                </p>
              </div>

              <div className="flex flex-col justify-end gap-4 lg:items-end">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a href="/#contact">
                    Conversar sobre a proposta
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Proposta emitida em {issuedAt}.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-border/70 bg-secondary/35 px-6 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10">
              <span>Eduardo Lima · Product Designer Sênior</span>
              <a
                href="#top"
                onClick={(event) => {
                  event.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="inline-flex min-h-10 items-center gap-2 font-medium text-foreground print:hidden"
              >
                Voltar ao início <ArrowUp aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
