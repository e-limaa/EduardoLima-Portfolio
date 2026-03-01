import { motion, useReducedMotion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ScanSearch, Workflow, Code2, Zap } from "lucide-react";
import { Section, SectionHeader } from "@antigravity/ds";
import { useLanguage } from "../language-provider";

const timelineData = [
  {
    id: 1,
    image: "/assets/images/curiosidade-aplicada.webp",
    icon: ScanSearch,
    color: "text-zinc-400",
  },
  {
    id: 2,
    image: "/assets/images/pensamento-sistemico.webp",
    icon: Workflow,
    color: "text-blue-500",
  },
  {
    id: 3,
    image: "/assets/images/execucao-tecnica.webp",
    icon: Code2,
    color: "text-zinc-300",
  },
  {
    id: 4,
    image: "/assets/images/evolucao-continua.webp",
    icon: Zap,
    color: "text-blue-400",
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
                  <span aria-hidden className="hidden lg:block h-14 w-px bg-gradient-to-b from-transparent via-zinc-300 dark:via-zinc-700 to-zinc-300 dark:to-zinc-700" />
                  <motion.div
                    variants={getIconVariants(shouldReduceMotion)}
                    className={`w-12 h-12 rounded-full border border-zinc-200 dark:border-zinc-800 bg-background flex items-center justify-center shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] dark:shadow-none ${item.color}`}
                  >
                    <item.icon aria-hidden="true" className="w-5 h-5" />
                  </motion.div>
                  <span aria-hidden className="hidden lg:block h-14 w-px bg-gradient-to-b from-zinc-300 dark:from-zinc-700 via-zinc-300 dark:via-zinc-700 to-transparent" />
                </div>

                <div className={`order-3 ${isEven ? "lg:order-3 lg:pl-8" : "lg:order-1 lg:pr-8"}`}>
                  <motion.div
                    variants={getMediaVariants(isEven, shouldReduceMotion)}
                    className="rounded-2xl overflow-hidden aspect-[3/2] transition-colors duration-500 shadow-sm dark:shadow-none bg-zinc-900/5"
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
