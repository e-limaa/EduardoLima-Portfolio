import { Layout, Component, Search, Code2 } from "lucide-react";
import { SectionHeader, Section } from "@antigravity/ds";
import { motion } from "motion/react";
import { useLanguage } from "../language-provider";

const services = [
  {
    titleKey: "services.design.title",
    descriptionKey: "services.design.desc",
    icon: Layout,
    hoverColorClass: "group-hover:text-blue-500",
    delay: 0.1,
  },
  {
    titleKey: "services.system.title",
    descriptionKey: "services.system.desc",
    icon: Component,
    hoverColorClass: "group-hover:text-indigo-500",
    delay: 0.2,
  },
  {
    titleKey: "services.consulting.title",
    descriptionKey: "services.consulting.desc",
    icon: Search,
    hoverColorClass: "group-hover:text-violet-500",
    delay: 0.3,
  },
  {
    titleKey: "services.dev.title",
    descriptionKey: "services.dev.desc",
    icon: Code2,
    hoverColorClass: "group-hover:text-fuchsia-500",
    delay: 0.4,
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 md:mt-12 hidden md:block" // Escondido no mobile, mostrado a partir do md
      >
        <a
          href="#contact"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
        >
          {t("services.cta")}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </motion.div>

      <ul className="list-none m-0 p-0 grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-200 dark:bg-white/5 border border-zinc-200 dark:border-white/10 overflow-hidden rounded-3xl backdrop-blur-sm shadow-sm dark:shadow-none mt-12">
        {services.map((service) => (
          <li key={service.titleKey} className="bg-background dark:bg-black/40 p-12 group hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors duration-500">
            <service.icon className={`w-8 h-8 text-muted-foreground ${service.hoverColorClass} transition-colors duration-500 mb-6`} />
            <h3 className="text-heading-md font-bold text-foreground mb-4">{t(service.titleKey)}</h3>
            <p className="text-body-md text-muted-foreground leading-relaxed">{t(service.descriptionKey)}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
};
