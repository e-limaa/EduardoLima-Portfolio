import { Layout, Component, Search, Code2, ArrowRight } from "lucide-react";
import { SectionHeader, Section } from "@limia/design-system";
import { useLanguage } from "../language-provider";
import { ContactFormModal } from "./ContactFormModal";

const services = [
  {
    titleKey: "services.design.title",
    descriptionKey: "services.design.desc",
    icon: Layout,
    hoverColorClass: "group-hover:text-primary",
  },
  {
    titleKey: "services.system.title",
    descriptionKey: "services.system.desc",
    icon: Component,
    hoverColorClass: "group-hover:text-primary",
  },
  {
    titleKey: "services.consulting.title",
    descriptionKey: "services.consulting.desc",
    icon: Search,
    hoverColorClass: "group-hover:text-primary",
  },
  {
    titleKey: "services.dev.title",
    descriptionKey: "services.dev.desc",
    icon: Code2,
    hoverColorClass: "group-hover:text-primary",
  },
];

export const Services = () => {
  const { t } = useLanguage();

  return (
    <Section id="services" className="py-16 md:py-24">
      <SectionHeader
        title={t("services.title")}
        description={t("services.description")}
        index="02"
        label={t("services.label")}
        align="left"
      />

      <ul className="mt-12 grid list-none grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border p-0 shadow-sm md:grid-cols-2">
        {services.map((service) => (
          <li key={service.titleKey} className="group flex flex-col bg-card/70 p-8 transition-colors duration-500 hover:bg-card md:p-12">
            <service.icon aria-hidden="true" className={`w-8 h-8 text-muted-foreground ${service.hoverColorClass} transition-colors duration-500 mb-6`} />
            <h3 className="text-heading-md font-bold text-foreground mb-4">{t(service.titleKey)}</h3>
            <p className="text-body-md text-muted-foreground leading-relaxed text-pretty">{t(service.descriptionKey)}</p>
            <ContactFormModal initialMessage={t("services.prefill").replace("{service}", t(service.titleKey))}>
              <button
                type="button"
                className="mt-8 inline-flex min-h-11 items-center gap-2 self-start rounded-full text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                aria-label={`${t("services.itemCta")}: ${t(service.titleKey)}`}
              >
                {t("services.itemCta")}
                <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </ContactFormModal>
          </li>
        ))}
      </ul>
    </Section>
  );
};


