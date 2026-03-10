import { Layout, Component, Search, Code2 } from "lucide-react";
import { SectionHeader, Section } from "@limia/design-system";
import { useLanguage } from "../language-provider";

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
    <Section id="services" className="py-16 md:py-32">
      <SectionHeader
        title={t("services.title")}
        description={t("services.description")}
        index="02"
        label={t("services.label")}
        align="left"
      />

      <ul className="mt-12 grid list-none grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border p-0 shadow-sm md:grid-cols-2">
        {services.map((service) => (
          <li key={service.titleKey} className="group bg-card/70 p-12 transition-colors duration-500 hover:bg-card">
            <service.icon className={`w-8 h-8 text-muted-foreground ${service.hoverColorClass} transition-colors duration-500 mb-6`} />
            <h3 className="text-heading-md font-bold text-foreground mb-4">{t(service.titleKey)}</h3>
            <p className="text-body-md text-muted-foreground leading-relaxed">{t(service.descriptionKey)}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
};


