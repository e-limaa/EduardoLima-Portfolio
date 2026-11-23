import { type KeyboardEvent, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Code2, ScanSearch, Workflow, Zap } from "lucide-react";
import { Section, cn } from "@limia/design-system";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useLanguage } from "../language-provider";
import { StudioSectionHeader } from "./StudioSectionHeader";
import { useStudioGlow } from "./useStudioGlow";

const timelineData = [
  {
    id: 1,
    image: "/assets/images/curiosidade-aplicada.webp",
    icon: ScanSearch,
  },
  {
    id: 2,
    image: "/assets/images/pensamento-sistemico.webp",
    icon: Workflow,
  },
  {
    id: 3,
    image: "/assets/images/execucao-tecnica.webp",
    icon: Code2,
  },
  {
    id: 4,
    image: "/assets/images/evolucao-continua.webp",
    icon: Zap,
  },
];

export const Storytelling = () => {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stageGlow = useStudioGlow();
  const activeTabGlow = useStudioGlow();

  const activeItem = timelineData[activeIndex];
  const sectionTitleId = "story-title";

  const selectIndex = (nextIndex: number) => {
    const wrappedIndex =
      (nextIndex + timelineData.length) % timelineData.length;
    setActiveIndex(wrappedIndex);
    return wrappedIndex;
  };

  const handlePrev = () => {
    selectIndex(activeIndex - 1);
  };

  const handleNext = () => {
    selectIndex(activeIndex + 1);
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    let targetIndex: number | null = null;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      targetIndex = (index + 1) % timelineData.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      targetIndex = (index - 1 + timelineData.length) % timelineData.length;
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = timelineData.length - 1;
    }

    if (targetIndex === null) return;

    event.preventDefault();
    setActiveIndex(targetIndex);
    tabRefs.current[targetIndex]?.focus();
  };

  return (
    <Section
      id="story"
      aria-labelledby={sectionTitleId}
      className="scroll-mt-12 py-20 md:py-28"
      noise={false}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-[8%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-[150px]"
      />

      <StudioSectionHeader
        title={t("story.title")}
        headingId={sectionTitleId}
        index="03"
        label={t("story.label")}
        description={t("story.description")}
      />

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
        <div
          role="tablist"
          aria-label={t("story.title")}
          className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-5 lg:grid-cols-1 lg:gap-3.5"
        >
          {timelineData.map((item, index) => {
            const isActive = index === activeIndex;
            const phaseLabel = `0${index + 1}`;
            const phaseTitle = t(`story.${item.id}.title`);
            const phaseYear = t(`story.${item.id}.year`);

            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`story-tab-${item.id}`}
                aria-selected={isActive}
                aria-controls="story-stage-panel"
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveIndex(index)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                onPointerMove={isActive ? activeTabGlow.onPointerMove : undefined}
                onPointerLeave={isActive ? activeTabGlow.onPointerLeave : undefined}
                className={cn(
                  "group relative flex flex-col justify-between overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:p-4 lg:flex-row lg:items-center lg:gap-4 lg:rounded-3xl lg:p-5",
                  isActive
                    ? "studio-glow-surface bg-layer-1/95 shadow-lg"
                    : "border border-border/70 bg-layer-1/50 hover:border-border-strong hover:bg-layer-1/80"
                )}
              >
                {isActive && (
                  <span
                    data-studio-bg="true"
                    aria-hidden="true"
                    className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary shadow-[0_0_16px_var(--action-primary-background)] lg:inset-x-auto lg:inset-y-4 lg:left-0 lg:h-auto lg:w-1"
                  />
                )}

                <div className="flex w-full flex-col gap-2.5 lg:flex-row lg:items-center lg:gap-4">
                  <div className="flex w-full items-center justify-between gap-2 lg:w-auto">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors duration-300 lg:h-12 lg:w-12 lg:rounded-2xl",
                        isActive
                          ? "border-primary/35 bg-primary/15 text-primary"
                          : "border-border/80 bg-layer-2/80 text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      <item.icon aria-hidden="true" className="h-4 w-4 lg:h-5 lg:w-5" />
                    </div>
                    <span
                      className={cn(
                        "font-mono text-xs font-semibold lg:hidden",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {phaseLabel}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="hidden items-center gap-2 lg:flex">
                      <span
                        className={cn(
                          "font-mono text-xs font-semibold",
                          isActive ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {phaseLabel}
                      </span>
                      <span className="truncate font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        · {phaseYear}
                      </span>
                    </div>
                    <p
                      className={cn(
                        "text-[13px] font-semibold leading-snug sm:text-sm lg:mt-1 lg:line-clamp-1 lg:text-heading-sm",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {phaseTitle}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-7">
          <div
            id="story-stage-panel"
            role="tabpanel"
            aria-labelledby={`story-tab-${activeItem.id}`}
            onPointerMove={stageGlow.onPointerMove}
            onPointerLeave={stageGlow.onPointerLeave}
            className="studio-glow-surface flex h-full flex-col overflow-hidden rounded-[2rem] bg-layer-1/85 shadow-2xl backdrop-blur-2xl"
          >
            <div className="relative aspect-square max-h-[460px] w-full overflow-hidden bg-black sm:aspect-[4/3]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 1.03 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.38, ease: "easeOut" }}
                  className="h-full w-full"
                >
                  <ImageWithFallback
                    src={activeItem.image}
                    alt={t(`story.${activeItem.id}.title`)}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={800}
                    className="h-full w-full object-cover object-[50%_22%]"
                  />
                </motion.div>
              </AnimatePresence>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
              />

              <div className="absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-3 sm:inset-x-6 sm:top-6">
                <span className="inline-flex items-center rounded-full border border-white/15 bg-black/65 px-3.5 py-1.5 font-mono text-xs tracking-wider text-white backdrop-blur-md">
                  {`0${activeIndex + 1} / 0${timelineData.length} · ${t(`story.${activeItem.id}.year`)}`}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label={t("story.prev")}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white backdrop-blur-md transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
                  >
                    <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label={t("story.next")}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white backdrop-blur-md transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
                  >
                    <ChevronRight aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem.id}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-2.5">
                    <activeItem.icon
                      aria-hidden="true"
                      className="h-4 w-4 text-primary"
                    />
                    <span className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                      {t(`story.${activeItem.id}.year`)}
                    </span>
                  </div>

                  <h3 className="mt-2.5 text-heading-lg md:text-heading-xl font-bold tracking-tight text-foreground">
                    {t(`story.${activeItem.id}.title`)}
                  </h3>

                  <p className="mt-3 max-w-2xl whitespace-pre-line text-body-md md:text-body-lg leading-relaxed text-pretty text-muted-foreground">
                    {t(`story.${activeItem.id}.desc`)}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2 pt-2">
                {timelineData.map((item, index) => {
                  const isCurrent = index === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`0${index + 1}: ${t(`story.${item.id}.title`)}`}
                      aria-pressed={isCurrent}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60",
                        isCurrent
                          ? "bg-primary shadow-[0_0_12px_var(--action-primary-background)]"
                          : "bg-border hover:bg-border-strong"
                      )}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
