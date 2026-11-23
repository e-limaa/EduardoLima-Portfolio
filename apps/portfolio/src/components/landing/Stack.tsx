import { motion, useReducedMotion } from "motion/react";
import { Code, Database, Figma, Layers, PenTool, Zap } from "lucide-react";
import { Section, cn } from "@limia/design-system";
import { useLanguage } from "../language-provider";
import { StudioSectionHeader } from "./StudioSectionHeader";
import { useStudioGlow } from "./useStudioGlow";

const tools = [
  {
    id: "figma",
    name: "Figma",
    icon: Figma,
    translationKey: "stack.tool.figma",
    categoryKey: "stack.category.design",
    spanClass: "md:col-span-3 lg:col-span-7",
  },
  {
    id: "ai",
    name: "AI Integration",
    icon: Zap,
    translationKey: "stack.tool.ai",
    categoryKey: "stack.category.ai",
    spanClass: "md:col-span-3 lg:col-span-5",
  },
  {
    id: "ds",
    name: "Design Systems",
    icon: Layers,
    translationKey: "stack.tool.ds",
    categoryKey: "stack.category.systems",
    spanClass: "md:col-span-3 lg:col-span-5",
  },
  {
    id: "react",
    name: "React / Next.js",
    icon: Code,
    translationKey: "stack.tool.react",
    categoryKey: "stack.category.engineering",
    spanClass: "md:col-span-3 lg:col-span-7",
  },
  {
    id: "automation",
    name: "Automation",
    icon: Database,
    translationKey: "stack.tool.automation",
    categoryKey: "stack.category.workflows",
    spanClass: "md:col-span-3 lg:col-span-6",
  },
  {
    id: "adobe",
    name: "Adobe Suite",
    icon: PenTool,
    translationKey: "stack.tool.adobe",
    categoryKey: "stack.category.visual",
    spanClass: "md:col-span-3 lg:col-span-6",
  },
] as const;

type ToolItem = (typeof tools)[number];

function StackMotif({ id }: { id: ToolItem["id"] }) {
  if (id === "figma") {
    return (
      <div
        data-studio-bg="true"
        aria-hidden="true"
        className="pointer-events-none absolute right-6 bottom-6 hidden h-20 w-28 rounded-xl border border-dashed border-border/60 p-2 opacity-50 transition-opacity duration-300 group-hover:opacity-85 sm:block"
      >
        <div className="h-2.5 w-10 rounded-full bg-border/60" />
        <div className="mt-2 grid grid-cols-2 gap-1.5">
          <div className="h-8 rounded-md border border-border/60 bg-layer-2/60" />
          <div className="h-8 rounded-md border border-primary/30 bg-primary/10" />
        </div>
      </div>
    );
  }

  if (id === "ai") {
    return (
      <div
        data-studio-bg="true"
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full bg-primary/15 blur-2xl transition-opacity duration-300 group-hover:bg-primary/25"
      />
    );
  }

  if (id === "ds") {
    return (
      <div
        data-studio-bg="true"
        aria-hidden="true"
        className="pointer-events-none absolute right-6 bottom-7 hidden items-center gap-1.5 opacity-60 transition-opacity duration-300 group-hover:opacity-100 sm:flex"
      >
        <span className="h-2.5 w-8 rounded-full bg-primary/70" />
        <span className="h-2.5 w-5 rounded-full bg-layer-3 border border-border-strong" />
        <span className="h-2.5 w-2.5 rounded-full border border-border-strong bg-layer-2" />
      </div>
    );
  }

  if (id === "react") {
    return (
      <span
        data-studio-bg="true"
        aria-hidden="true"
        className="pointer-events-none absolute right-6 bottom-6 hidden font-mono text-xs tracking-tight text-muted-foreground/35 transition-colors duration-300 group-hover:text-primary/50 sm:block"
      >
        {"<Limia.Surface />"}
      </span>
    );
  }

  if (id === "automation") {
    return (
      <div
        data-studio-bg="true"
        aria-hidden="true"
        className="pointer-events-none absolute right-6 bottom-7 hidden items-center gap-1.5 opacity-45 transition-opacity duration-300 group-hover:opacity-85 sm:flex"
      >
        <span className="h-2 w-2 rounded-full bg-primary/70" />
        <span className="h-px w-6 bg-border-strong" />
        <span className="h-2 w-2 rounded-full border border-primary/70" />
        <span className="h-px w-6 bg-border-strong" />
        <span className="h-2 w-2 rounded-full bg-border-strong" />
      </div>
    );
  }

  return (
    <div
      data-studio-bg="true"
      aria-hidden="true"
      className="pointer-events-none absolute right-6 bottom-6 hidden h-6 w-6 opacity-45 transition-opacity duration-300 group-hover:opacity-85 sm:block"
    >
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border-strong" />
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border-strong" />
    </div>
  );
}

function StackCard({
  tool,
  index,
}: {
  tool: ToolItem;
  index: number;
}) {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const glow = useStudioGlow();

  return (
    <motion.li
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      onPointerMove={glow.onPointerMove}
      onPointerLeave={glow.onPointerLeave}
      className={cn(
        "studio-glow-surface group flex min-h-[210px] flex-col justify-between overflow-hidden rounded-3xl bg-layer-1/80 p-7 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 md:p-8",
        tool.spanClass
      )}
    >
      <StackMotif id={tool.id} />

      <div className="flex items-center justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border/80 bg-layer-2/90 text-muted-foreground transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary">
          <tool.icon aria-hidden="true" className="h-6 w-6" />
        </div>

        <span className="rounded-full border border-border/70 bg-layer-2/70 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          {t(tool.categoryKey)}
        </span>
      </div>

      <div className="mt-8 max-w-md">
        <h3 className="text-heading-sm md:text-heading-md font-semibold tracking-tight text-foreground">
          {tool.name}
        </h3>
        <p className="mt-2 text-body-sm md:text-body-md leading-relaxed text-muted-foreground">
          {t(tool.translationKey)}
        </p>
      </div>
    </motion.li>
  );
}

export const Stack = () => {
  const { t } = useLanguage();

  return (
    <Section id="stack" className="scroll-mt-12 py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[14%] h-[360px] w-[360px] rounded-full bg-primary/10 blur-[140px]"
      />

      <StudioSectionHeader
        title={t("stack.title")}
        description={t("stack.description")}
        index="04"
        label={t("stack.label")}
      />

      <ul className="m-0 grid list-none grid-cols-1 gap-5 p-0 md:grid-cols-6 lg:grid-cols-12">
        {tools.map((tool, index) => (
          <StackCard key={tool.name} tool={tool} index={index} />
        ))}
      </ul>
    </Section>
  );
};
