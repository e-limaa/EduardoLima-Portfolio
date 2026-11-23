import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, FolderKanban, Sparkles } from "lucide-react";
import { Button, Section, cn } from "@limia/design-system";
import { getImageSrcSet, getImageUrl, useProjects } from "../../lib/project-service";
import type { Project } from "../../lib/sanity-types";
import { useLanguage } from "../language-provider";
import { ContactFormModal } from "./ContactFormModal";
import { StudioSectionHeader } from "./StudioSectionHeader";
import { useStudioGlow } from "./useStudioGlow";

const FALLBACK_IMAGE_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDkwOTBiIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTcxNzJiIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=";

function getProjectGridLayout(count: number, index: number) {
  let spanClass = "lg:col-span-6";

  if (count === 1) {
    spanClass = "md:col-span-2 lg:col-span-12";
  } else if (count === 2) {
    spanClass = index === 0 ? "lg:col-span-7" : "lg:col-span-5";
  } else if (count === 3) {
    spanClass =
      index === 0
        ? "lg:col-span-7"
        : index === 1
          ? "lg:col-span-5"
          : "md:col-span-2 lg:col-span-12";
  } else if (count === 4) {
    spanClass = index === 0 || index === 3 ? "lg:col-span-7" : "lg:col-span-5";
  } else if (count === 5) {
    spanClass =
      index === 0
        ? "lg:col-span-7"
        : index === 1
          ? "lg:col-span-5"
          : index === 4
            ? "md:col-span-2 lg:col-span-4"
            : "lg:col-span-4";
  } else {
    spanClass =
      index === 0 || index === 3
        ? "lg:col-span-7"
        : index === 1 || index === 2
          ? "lg:col-span-5"
          : "lg:col-span-6";
  }

  const isLead =
    count === 1 ||
    (count === 3 && index === 2) ||
    index === 0 ||
    (count >= 4 && index === 3);

  return { spanClass, isLead };
}

function StudioProjectCard({
  project,
  index,
  isLead,
  ctaLabel,
  featuredLabel,
  onSelect,
}: {
  project: Project;
  index: number;
  isLead: boolean;
  ctaLabel: string;
  featuredLabel: string;
  onSelect?: (slug: string) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const glow = useStudioGlow();
  const resolvedImage = getImageUrl(project.thumbnail || project.mainImage, 1080);
  const resolvedSrcSet = getImageSrcSet(project.thumbnail || project.mainImage);
  const [imgSrc, setImgSrc] = useState(resolvedImage || FALLBACK_IMAGE_SRC);
  const [useFallback, setUseFallback] = useState(!resolvedImage);

  useEffect(() => {
    setImgSrc(resolvedImage || FALLBACK_IMAGE_SRC);
    setUseFallback(!resolvedImage);
  }, [resolvedImage]);

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: Math.min(index, 3) * 0.08 }}
      onPointerMove={glow.onPointerMove}
      onPointerLeave={glow.onPointerLeave}
      className="studio-glow-surface group h-full overflow-hidden rounded-[1.75rem] bg-layer-1/85 shadow-xl transition-transform duration-300 hover:-translate-y-1"
    >
      <button
        type="button"
        onClick={() => onSelect?.(project.slug.current)}
        aria-label={`${ctaLabel}: ${project.title}`}
        className={cn(
          "relative flex h-full w-full flex-col justify-between overflow-hidden text-left focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/60",
          isLead ? "min-h-[420px] md:min-h-[480px] lg:min-h-[520px]" : "min-h-[420px] md:min-h-[480px]"
        )}
      >
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-zinc-950">
          <img
            src={imgSrc}
            srcSet={!useFallback ? resolvedSrcSet : undefined}
            sizes={
              isLead
                ? "(min-width: 1024px) 58vw, 100vw"
                : "(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw"
            }
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => {
              setUseFallback(true);
              setImgSrc(FALLBACK_IMAGE_SRC);
            }}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/20" />
        </div>

        <div className="relative z-10 flex w-full flex-wrap items-center justify-between gap-2 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-white/15 bg-black/55 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur-md">
              {project.category}
            </span>
            {index === 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/85 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-primary-foreground backdrop-blur-md">
                <Sparkles aria-hidden="true" className="h-3 w-3" />
                {featuredLabel}
              </span>
            )}
          </div>

          {project.year && (
            <span className="inline-flex items-center rounded-full border border-white/15 bg-black/55 px-3 py-1 font-mono text-xs text-white/85 backdrop-blur-md">
              {project.year}
            </span>
          )}
        </div>

        <div className="relative z-10 mt-auto w-full p-6 md:p-8">
          {project.client && (
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-white/70">
              {project.client}
            </p>
          )}

          <h3 className="text-heading-md md:text-heading-lg font-bold tracking-tight text-white">
            {project.title}
          </h3>

          {isLead && project.description && (
            <p className="mt-2.5 line-clamp-2 max-w-xl text-body-sm md:text-body-md leading-relaxed text-white/75">
              {project.description}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/15 pt-4">
            {project.metric ? (
              <span className="min-w-0 truncate rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 font-mono text-xs text-white backdrop-blur-md md:text-sm">
                {project.metric}
              </span>
            ) : (
              <span />
            )}

            <span className="ml-auto inline-flex shrink-0 items-center gap-3 text-sm font-medium text-white">
              <span className="hidden whitespace-nowrap font-mono text-xs uppercase tracking-wider text-white/85 sm:inline">
                {ctaLabel}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/15 text-white transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </span>
          </div>
        </div>
      </button>
    </motion.article>
  );
}

export const Projects = ({ onProjectClick }: { onProjectClick?: (id: string) => void }) => {
  const [activeTab, setActiveTab] = useState<"ui" | "study">("ui");
  const [shouldLoadProjects, setShouldLoadProjects] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { language, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const { projects, isLoading: loading, isError } = useProjects(language, shouldLoadProjects);
  const emptySurfaceGlow = useStudioGlow();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || shouldLoadProjects) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry?.isIntersecting) return;

        setShouldLoadProjects(true);
        observer.disconnect();
      },
      {
        rootMargin: "600px 0px",
        threshold: 0.01,
      }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldLoadProjects]);

  // Only offer the UX Research tab when there is research to show; an empty
  // tab reads as missing work.
  const hasStudies = projects.some((project) => project.categoryKind === "study");
  const currentTab = hasStudies ? activeTab : "ui";
  const filteredProjects = projects.filter((project) => {
    const isStudy = project.categoryKind === "study";
    return currentTab === "study" ? isStudy : !isStudy;
  });

  const featuredProjects = filteredProjects.slice(0, 6);

  return (
    <div id="projects" ref={sectionRef} className="scroll-mt-12">
      <Section className="py-20 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-[10%] h-[420px] w-[420px] rounded-full bg-primary/10 blur-[140px]"
        />

        <StudioSectionHeader
          title={t("projects.title")}
          description={t("projects.description")}
          index="01"
          label={t("projects.label")}
        >
          {hasStudies && (
            <div
              role="tablist"
              aria-label={t("projects.label")}
              className="inline-flex items-center rounded-full border border-border/80 bg-layer-1/80 p-1 shadow-xs backdrop-blur-md"
            >
              {(
                [
                  { value: "ui", label: t("projects.tab.ui") },
                  { value: "study", label: t("projects.tab.ux") },
                ] as const
              ).map((tab) => {
                const isSelected = currentTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      "relative min-h-10 rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:px-5",
                      isSelected ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="projects-tab-pill"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 380, damping: 32 }
                        }
                        className="absolute inset-0 rounded-full bg-primary shadow-sm"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </StudioSectionHeader>

        {!shouldLoadProjects || loading ? (
          <>
            <p role="status" aria-live="polite" className="sr-only">
              {t("projects.loading")}
            </p>

            <ul
              aria-hidden="true"
              className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-12"
            >
              {[
                "lg:col-span-7 min-h-[420px] md:min-h-[480px] lg:min-h-[520px]",
                "lg:col-span-5 min-h-[420px] md:min-h-[480px]",
                "lg:col-span-5 min-h-[420px] md:min-h-[480px]",
                "lg:col-span-7 min-h-[420px] md:min-h-[480px] lg:min-h-[520px]",
              ].map((skeletonClass, index) => (
                <li
                  key={index}
                  className={cn(
                    "flex flex-col justify-between overflow-hidden rounded-[1.75rem] border border-border/70 bg-layer-1/60 p-6 backdrop-blur-xl md:p-8",
                    skeletonClass
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="h-7 w-28 rounded-full bg-muted/60" />
                    <div className="h-7 w-14 rounded-full bg-muted/45" />
                  </div>
                  <div className="space-y-3 pt-12">
                    <div className="h-3 w-24 rounded-full bg-muted/50" />
                    <div className="h-8 w-3/4 rounded-full bg-muted/60" />
                    <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                      <div className="h-7 w-32 rounded-full bg-muted/45" />
                      <div className="h-10 w-10 rounded-full bg-muted/50" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : isError || featuredProjects.length === 0 ? (
          <div
            onPointerMove={emptySurfaceGlow.onPointerMove}
            onPointerLeave={emptySurfaceGlow.onPointerLeave}
            className="studio-glow-surface mx-auto max-w-2xl rounded-3xl bg-layer-1/80 p-10 text-center shadow-xl backdrop-blur-xl md:p-14"
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-border/80 bg-layer-2/90 text-primary">
              <FolderKanban aria-hidden="true" className="h-6 w-6" />
            </div>
            <p className="mx-auto max-w-md text-body-lg leading-relaxed text-pretty text-muted-foreground">
              {t(isError ? "projects.error" : "projects.empty")}
            </p>
            <div className="mt-7 flex justify-center">
              <ContactFormModal>
                <Button size="lg" className="group">
                  {t("projects.emptyCta")}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Button>
              </ContactFormModal>
            </div>
          </div>
        ) : (
          <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-12">
            {featuredProjects.map((project, index) => {
              const { spanClass, isLead } = getProjectGridLayout(
                featuredProjects.length,
                index
              );
              return (
                <li key={project._id} className={spanClass}>
                  <StudioProjectCard
                    project={project}
                    index={index}
                    isLead={isLead}
                    ctaLabel={t("projects.viewCase")}
                    featuredLabel={t("projects.featured")}
                    onSelect={onProjectClick}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </div>
  );
};
