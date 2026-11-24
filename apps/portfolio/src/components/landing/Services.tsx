import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Code2, Component, Layout, Search } from "lucide-react";
import { Button, Section } from "@limia/design-system";
import { useLanguage } from "../language-provider";
import { ContactFormModal } from "./ContactFormModal";
import { StudioSectionHeader } from "./StudioSectionHeader";
import { useStudioGlow } from "./useStudioGlow";

const services = [
  {
    index: "01",
    titleKey: "services.design.title",
    descriptionKey: "services.design.desc",
    tagsKey: "services.design.tags",
    icon: Layout,
  },
  {
    index: "02",
    titleKey: "services.system.title",
    descriptionKey: "services.system.desc",
    tagsKey: "services.system.tags",
    icon: Component,
  },
  {
    index: "03",
    titleKey: "services.consulting.title",
    descriptionKey: "services.consulting.desc",
    tagsKey: "services.consulting.tags",
    icon: Search,
  },
  {
    index: "04",
    titleKey: "services.dev.title",
    descriptionKey: "services.dev.desc",
    tagsKey: "services.dev.tags",
    icon: Code2,
  },
];

function ServiceCard({
  service,
  cardIndex,
}: {
  service: (typeof services)[number];
  cardIndex: number;
}) {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const glow = useStudioGlow();
  const serviceTitle = t(service.titleKey);
  const tags = t(service.tagsKey)
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return (
    <motion.li
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: cardIndex * 0.08 }}
      onPointerMove={glow.onPointerMove}
      onPointerLeave={glow.onPointerLeave}
      className="studio-glow-surface group flex h-full flex-col justify-between rounded-3xl bg-layer-1/80 p-8 shadow-sm backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 lg:p-10"
    >
      <div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/80 bg-layer-2/90 text-primary transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:shadow-[0_0_24px_color-mix(in_oklab,var(--action-primary-background)_28%,transparent)]">
            <service.icon aria-hidden="true" className="h-6 w-6" />
          </div>
          <span className="font-mono text-xs text-muted-foreground/80">
            {service.index}
          </span>
        </div>

        <h3 className="mt-8 text-heading-md md:text-heading-lg font-semibold tracking-tight text-foreground">
          {serviceTitle}
        </h3>
        <p className="mt-3 max-w-xl text-body-md leading-relaxed text-pretty text-muted-foreground">
          {t(service.descriptionKey)}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/80 bg-layer-2/70 px-3 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-border/60 pt-5">
        <ContactFormModal
          initialMessage={t("services.prefill").replace("{service}", serviceTitle)}
        >
          <button
            type="button"
            className="group/btn flex min-h-11 w-full items-center justify-between gap-3 rounded-xl text-left text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            aria-label={`${t("services.itemCta")}: ${serviceTitle}`}
          >
            <span>{t("services.itemCta")}</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-layer-2 text-foreground transition-all duration-300 group-hover/btn:border-primary group-hover/btn:bg-primary group-hover/btn:text-primary-foreground">
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5"
              />
            </span>
          </button>
        </ContactFormModal>
      </div>
    </motion.li>
  );
}

export const Services = () => {
  const { t } = useLanguage();

  return (
    <Section id="services" className="scroll-mt-12 py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 left-[6%] h-[380px] w-[380px] rounded-full bg-primary/10 blur-[140px]"
      />

      <StudioSectionHeader
        title={t("services.title")}
        description={t("services.description")}
        index="02"
        label={t("services.label")}
      >
        <ContactFormModal>
          <Button size="lg" className="group gap-2">
            <span>{t("services.cta")}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Button>
        </ContactFormModal>
      </StudioSectionHeader>

      <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
        {services.map((service, cardIndex) => (
          <ServiceCard
            key={service.titleKey}
            service={service}
            cardIndex={cardIndex}
          />
        ))}
      </ul>
    </Section>
  );
};
