import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  cn,
} from "@limia/design-system";
import { getImageSrcSet, getImageUrl } from "../../lib/project-service";
import type { Project, SanityImage, SolutionBlock } from "../../lib/sanity-types";
import { useLanguage } from "../language-provider";
import { useStudioGlow } from "./useStudioGlow";

const FALLBACK_SCREEN_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDkwOTBiIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTcxNzJiIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=";

function isSolutionBlock(
  item: string | SanityImage | SolutionBlock
): item is SolutionBlock {
  return (
    typeof item === "object" &&
    item !== null &&
    "_type" in item &&
    item._type === "solution"
  );
}

export function extractProjectGalleryImages(
  project: Project
): Array<string | SanityImage> {
  if (!Array.isArray(project.gallery)) return [];
  return project.gallery.filter(
    (item): item is string | SanityImage => Boolean(item) && !isSolutionBlock(item)
  );
}

export function ProjectQuickViewModal({
  projects,
  activeProjectIndex,
  onClose,
  onSelectProjectIndex,
  onOpenFullCase,
}: {
  projects: Project[];
  activeProjectIndex: number | null;
  onClose: () => void;
  onSelectProjectIndex: (index: number) => void;
  onOpenFullCase: (slug: string) => void;
}) {
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const modalGlow = useStudioGlow();
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "challenge">("overview");
  const [slideImgError, setSlideImgError] = useState(false);

  const activeProject =
    activeProjectIndex !== null ? (projects[activeProjectIndex] ?? null) : null;

  const slides: Array<string | SanityImage> = activeProject
    ? (() => {
        const galleryImages = extractProjectGalleryImages(activeProject);
        if (galleryImages.length > 0) return galleryImages;
        return [activeProject.mainImage, activeProject.thumbnail].filter(
          (item): item is string | SanityImage => Boolean(item)
        );
      })()
    : [];

  const safeSlideIndex =
    slides.length > 0 ? Math.min(activeSlideIndex, slides.length - 1) : 0;
  const activeSlide = slides[safeSlideIndex];

  useEffect(() => {
    setActiveSlideIndex(0);
    setActiveTab("overview");
    setSlideImgError(false);
  }, [activeProject?._id]);

  useEffect(() => {
    setSlideImgError(false);
  }, [safeSlideIndex]);

  useEffect(() => {
    if (!activeProject || slides.length <= 1) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveSlideIndex((prev) => (prev + 1) % slides.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeProject, slides.length]);

  if (!activeProject || activeProjectIndex === null) {
    return (
      <Dialog open={false} onOpenChange={(open: boolean) => !open && onClose()}>
        <DialogContent className="hidden" />
      </Dialog>
    );
  }

  const hasOverview = Boolean(activeProject.description?.trim());
  const hasChallenge = Boolean(activeProject.challenge?.trim());
  const showDetailTabs = hasOverview && hasChallenge;
  const activeNarrative =
    activeTab === "challenge" && hasChallenge
      ? activeProject.challenge
      : hasOverview
        ? activeProject.description
        : activeProject.challenge;

  const cleanedStack = (activeProject.stack ?? [])
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item));

  const cleanedMetricLabel =
    activeProject.metricLabel?.replace(/:\s*$/, "").trim() ||
    t("projects.metricLabel");

  const activeSlideUrl = activeSlide ? getImageUrl(activeSlide, 1440) : "";
  const activeSlideSrcSet = activeSlide ? getImageSrcSet(activeSlide) : undefined;
  const activeSlideAlt =
    typeof activeSlide === "object" && activeSlide?.alt
      ? activeSlide.alt
      : `${activeProject.title} — ${safeSlideIndex + 1}/${slides.length}`;
  const activeSlideCaption =
    typeof activeSlide === "object" && activeSlide?.caption
      ? activeSlide.caption
      : undefined;

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="project-quick-view z-[80] flex max-h-[92dvh] w-full max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-[1.75rem] border-0 bg-transparent p-0 text-foreground shadow-2xl sm:max-w-[calc(100%-3rem)] lg:max-w-5xl xl:max-w-6xl [&>button:last-child]:top-3.5 [&>button:last-child]:right-4 [&>button:last-child]:z-30 [&>button:last-child]:flex [&>button:last-child]:h-10 [&>button:last-child]:w-10 [&>button:last-child]:items-center [&>button:last-child]:justify-center [&>button:last-child]:rounded-full [&>button:last-child]:border [&>button:last-child]:border-border/80 [&>button:last-child]:bg-layer-2/90 [&>button:last-child]:text-foreground [&>button:last-child]:opacity-100 [&>button:last-child]:backdrop-blur-md [&>button:last-child]:transition-colors [&>button:last-child]:hover:border-primary/40 [&>button:last-child]:hover:bg-primary [&>button:last-child]:hover:text-primary-foreground">
        <div
          onPointerMove={modalGlow.onPointerMove}
          onPointerLeave={modalGlow.onPointerLeave}
          className="studio-glow-surface flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-[1.75rem] bg-layer-1/95 backdrop-blur-2xl"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-layer-2/60 py-3.5 pl-5 pr-18 sm:pl-7 sm:pr-20">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="font-mono font-semibold text-primary">
                {`0${activeProjectIndex + 1} / 0${projects.length}`}
              </span>
              {activeProject.client && (
                <>
                  <span aria-hidden="true" className="text-border-strong">
                    ·
                  </span>
                  <span className="font-mono uppercase tracking-wider text-foreground/90">
                    {activeProject.client}
                  </span>
                </>
              )}
              {activeProject.year && (
                <>
                  <span aria-hidden="true" className="text-border-strong">
                    ·
                  </span>
                  <span className="font-mono text-muted-foreground">
                    {activeProject.year}
                  </span>
                </>
              )}
              {activeProject.category && (
                <span className="rounded-full border border-border/80 bg-layer-1/80 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {activeProject.category}
                </span>
              )}
            </div>

            {projects.length > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onSelectProjectIndex(
                      (activeProjectIndex - 1 + projects.length) % projects.length
                    )
                  }
                  aria-label={t("projects.prevProject")}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-layer-1/80 text-foreground transition-colors hover:border-primary/40 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onSelectProjectIndex((activeProjectIndex + 1) % projects.length)
                  }
                  aria-label={t("projects.nextProject")}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/80 bg-layer-1/80 text-foreground transition-colors hover:border-primary/40 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div className="grid flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-12">
            <div className="flex flex-col gap-4 border-b border-border/60 bg-background/60 p-5 sm:p-6 lg:col-span-7 lg:border-r lg:border-b-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/70 bg-zinc-950 shadow-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeProject._id}-${safeSlideIndex}`}
                    initial={shouldReduceMotion ? false : { opacity: 0 }}
                    animate={shouldReduceMotion ? undefined : { opacity: 1 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="h-full w-full"
                  >
                    <img
                      src={
                        !slideImgError && activeSlideUrl
                          ? activeSlideUrl
                          : FALLBACK_SCREEN_SRC
                      }
                      srcSet={
                        !slideImgError && activeSlideSrcSet
                          ? activeSlideSrcSet
                          : undefined
                      }
                      sizes="(min-width: 1024px) 58vw, 95vw"
                      alt={activeSlideAlt}
                      onError={() => setSlideImgError(true)}
                      className="h-full w-full object-contain"
                    />
                  </motion.div>
                </AnimatePresence>

                {slides.length > 0 && (
                  <span className="pointer-events-none absolute top-3.5 left-3.5 z-10 rounded-full border border-white/15 bg-black/70 px-3 py-1 font-mono text-xs text-white backdrop-blur-md">
                    {`${safeSlideIndex + 1} / ${slides.length}`}
                  </span>
                )}

                {slides.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSlideIndex(
                          (safeSlideIndex - 1 + slides.length) % slides.length
                        )
                      }
                      aria-label={t("projects.prevScreen")}
                      className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white backdrop-blur-md transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
                    >
                      <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSlideIndex((safeSlideIndex + 1) % slides.length)
                      }
                      aria-label={t("projects.nextScreen")}
                      className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white backdrop-blur-md transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60"
                    >
                      <ChevronRight aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>

              {activeSlideCaption && (
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {activeSlideCaption}
                </p>
              )}

              {slides.length > 1 && (
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {slides.map((slide, index) => {
                    const isSelected = index === safeSlideIndex;
                    const thumbUrl = getImageUrl(slide, 360);
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveSlideIndex(index)}
                        aria-label={`${t("projects.screensCount").replace("{count}", String(slides.length))} — ${index + 1}`}
                        aria-pressed={isSelected}
                        className={cn(
                          "aspect-[4/3] w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-zinc-950 transition-all focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-24",
                          isSelected
                            ? "border-primary opacity-100 shadow-[0_0_14px_color-mix(in_oklab,var(--action-primary-background)_35%,transparent)]"
                            : "border-border/70 opacity-60 hover:opacity-100"
                        )}
                      >
                        <img
                          src={thumbUrl || FALLBACK_SCREEN_SRC}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between gap-6 p-5 sm:p-7 lg:col-span-5">
              <div className="space-y-5">
                <div>
                  <DialogTitle className="text-heading-md sm:text-heading-lg font-bold tracking-tight text-foreground">
                    {activeProject.title}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    {[activeProject.client, activeProject.category, activeProject.year]
                      .filter(Boolean)
                      .join(" — ")}
                  </DialogDescription>
                </div>

                {(activeProject.role?.trim() || activeProject.metric?.trim()) && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {activeProject.role?.trim() && (
                      <div className="rounded-2xl border border-border/70 bg-layer-2/70 px-4 py-3">
                        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          {t("project.role")}
                        </p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {activeProject.role.trim()}
                        </p>
                      </div>
                    )}

                    {activeProject.metric?.trim() && (
                      <div className="rounded-2xl border border-border/70 bg-layer-2/70 px-4 py-3">
                        <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                          {cleanedMetricLabel}
                        </p>
                        <p className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground">
                          <span
                            aria-hidden="true"
                            className="h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_10px_var(--action-primary-background)]"
                          />
                          <span>{activeProject.metric.trim()}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeNarrative && (
                  <div className="space-y-3">
                    {showDetailTabs && (
                      <div
                        role="tablist"
                        className="inline-flex items-center rounded-full border border-border/80 bg-layer-2/80 p-1"
                      >
                        {(
                          [
                            { value: "overview", label: t("projects.tab.overview") },
                            { value: "challenge", label: t("projects.tab.challenge") },
                          ] as const
                        ).map((tab) => {
                          const isSelected = activeTab === tab.value;
                          return (
                            <button
                              key={tab.value}
                              type="button"
                              role="tab"
                              aria-selected={isSelected}
                              onClick={() => setActiveTab(tab.value)}
                              className={cn(
                                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                                isSelected
                                  ? "bg-primary text-primary-foreground shadow-xs"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {tab.label}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <p className="text-body-sm sm:text-body-md leading-relaxed text-pretty text-muted-foreground">
                      {activeNarrative}
                    </p>
                  </div>
                )}

                {cleanedStack.length > 0 && (
                  <div>
                    <p className="mb-2.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      {t("projects.stackLabel")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cleanedStack.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-border/80 bg-layer-2/75 px-3 py-1 font-mono text-xs text-foreground/90"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-auto flex shrink-0 flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="group w-full shrink-0 justify-center gap-2 sm:flex-1"
                  onClick={() => {
                    onClose();
                    onOpenFullCase(activeProject.slug.current);
                  }}
                >
                  <span>{t("projects.openFullCase")}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Button>

                {projects.length > 1 && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="shrink-0 justify-center gap-1.5"
                    onClick={() =>
                      onSelectProjectIndex((activeProjectIndex + 1) % projects.length)
                    }
                  >
                    <span>{t("projects.nextCase")}</span>
                    <ChevronRight aria-hidden="true" className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
