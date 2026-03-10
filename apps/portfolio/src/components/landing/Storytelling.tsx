import { motion, useReducedMotion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ScanSearch, Workflow, Code2, Zap } from "lucide-react";
import { Section, SectionHeader } from "@limia/design-system";
import { useLanguage } from "../language-provider";

const timelineData = [
  {
    id: 1,
    image: "/assets/images/curiosidade-aplicada.webp",
    icon: ScanSearch,
    color: "text-muted-foreground",
  },
  {
    id: 2,
    image: "/assets/images/pensamento-sistemico.webp",
    icon: Workflow,
    color: "text-primary",
  },
  {
    id: 3,
    image: "/assets/images/execucao-tecnica.webp",
    icon: Code2,
    color: "text-foreground/80",
  },
  {
    id: 4,
    image: "/assets/images/evolucao-continua.webp",
    icon: Zap,
    color: "text-primary",
  }
];

const getTextVariants = (isEven: boolean, shouldReduceMotion: boolean) =>
  shouldReduceMotion
    ? {
      initial: { x: 0, opacity: 1 },
      animate: { x: 0, opacity: 1 },
    }
    : {
      initial: { x: isEven ? -50 : 50, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
    };

const getIconVariants = (shouldReduceMotion: boolean) =>
  shouldReduceMotion
    ? {
      initial: { scale: 1, opacity: 1 },
      animate: { scale: 1, opacity: 1 },
    }
    : {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1.1, opacity: 1, transition: { duration: 0.5, delay: 0.2 } },
    };

const getMediaVariants = (isEven: boolean, shouldReduceMotion: boolean) =>
  shouldReduceMotion
    ? {
      initial: { x: 0, opacity: 1 },
      animate: { x: 0, opacity: 1 },
    }
    : {
      initial: { x: isEven ? 50 : -50, opacity: 0 },
      animate: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
    };

const getImageVariants = (shouldReduceMotion: boolean) =>
  shouldReduceMotion
    ? {
      initial: { filter: "grayscale(0%)", opacity: 1, scale: 1 },
      animate: { filter: "grayscale(0%)", opacity: 1, scale: 1 },
    }
    : {
      initial: { filter: "grayscale(100%)", opacity: 0.4, scale: 1 },
      animate: { filter: "grayscale(0%)", opacity: 1, scale: 1.05, transition: { duration: 0.8 } },
    };

export const Storytelling = () => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const sectionTitleId = "story-title";

  return (
    <Section
      id="story"
      aria-labelledby={sectionTitleId}
      className="py-12 md:py-24"
      grid={false}
      noise={false}
    >
      <SectionHeader
        title={t("story.title")}
        headingId={sectionTitleId}
        index="03"
        label={t("story.label")}
        description={t("story.description")}
      />
      <ol className="list-none m-0 p-0 mt-12 md:mt-20 flex flex-col gap-12 md:gap-20">
        {timelineData.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <li key={item.id}>
              <motion.article
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-20%" }}
                className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-10 items-center"
              >
                <div className={`order-1 ${isEven ? "lg:order-1 lg:text-right lg:pr-8" : "lg:order-3 lg:text-left lg:pl-8"}`}>
                  <motion.div variants={getTextVariants(isEven, shouldReduceMotion)}>
                    <span className={`text-sm font-mono font-bold tracking-widest uppercase mb-2 block ${item.color}`}>
                      {t(`story.${item.id}.year`)}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                      {t(`story.${item.id}.title`)}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-sm md:text-base whitespace-pre-line">
                      {t(`story.${item.id}.desc`)}
                    </p>
                  </motion.div>
                </div>

                <div className="order-2 flex items-center gap-4 lg:order-2 lg:flex-col lg:gap-3">
                  <span aria-hidden className="hidden h-14 w-px bg-gradient-to-b from-transparent via-border to-border lg:block" />
                  <motion.div
                    variants={getIconVariants(shouldReduceMotion)}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card shadow-sm ${item.color}`}
                  >
                    <item.icon aria-hidden="true" className="w-5 h-5" />
                  </motion.div>
                  <span aria-hidden className="hidden h-14 w-px bg-gradient-to-b from-border via-border to-transparent lg:block" />
                </div>

                <div className={`order-3 ${isEven ? "lg:order-3 lg:pl-8" : "lg:order-1 lg:pr-8"}`}>
                  <motion.div
                    variants={getMediaVariants(isEven, shouldReduceMotion)}
                    className="aspect-[3/2] overflow-hidden rounded-2xl bg-muted/30 shadow-sm transition-colors duration-500"
                  >
                    <motion.div variants={getImageVariants(shouldReduceMotion)} className="w-full h-full">
                      <ImageWithFallback
                        src={item.image}
                        alt={t(`story.${item.id}.title`)}
                        loading="lazy"
                        decoding="async"
                        width={800}
                        height={533}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  </motion.div>
                </div>
              </motion.article>
            </li>
          );
        })}
      </ol>
    </Section>
  );
};

