import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Eye, FolderKanban, Layers } from "lucide-react";
import { Button, Section, cn } from "@limia/design-system";
import { getImageSrcSet, getImageUrl, useProjects } from "../../lib/project-service";
import type { Project } from "../../lib/sanity-types";
import { useLanguage } from "../language-provider";
import { ContactFormModal } from "./ContactFormModal";
import {
  ProjectQuickViewModal,
  extractProjectGalleryImages,
} from "./ProjectQuickViewModal";
import { StudioSectionHeader } from "./StudioSectionHeader";
import { useStudioGlow } from "./useStudioGlow";

const FALLBACK_IMAGE_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDkwOTBiIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMTcxNzJiIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSI2MDAiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=";

function ProjectGalleryCard({
  project,
  index,
  onPreview,
  onSelect,
}: {
  project: Project;
  index: number;
  onPreview: () => void;
  onSelect?: (slug: string) => void;
}) {
  const { t } = useLanguage();
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

  const screenCount = extractProjectGalleryImages(project).length;

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: Math.min(index, 2) * 0.08 }}
      onPointerMove={glow.onPointerMove}
      onPointerLeave={glow.onPointerLeave}
      className="studio-glow-surface group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-layer-1/85 shadow-lg backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1.5"
    >
      <button
        type="button"
        onClick={onPreview}
        aria-label={`${t("projects.quickView")}: ${project.title}`}
        className="relative block aspect-[5/6] w-full overflow-hidden border-b border-border/60 bg-layer-2 text-left focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/60"
      >
        <img
          src={imgSrc}
          srcSet={!useFallback ? resolvedSrcSet : undefined}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          alt={project.title}
          loading="lazy"
          decoding="async"
          onError={() => {
            setUseFallback(true);
            setImgSrc(FALLBACK_IMAGE_SRC);
          }}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />

        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 bottom-4 inline-flex translate-y-1.5 items-center gap-1.5 rounded-full border border-white/15 bg-black/75 px-3.5 py-2 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>{t("projects.quickView")}</span>
        </span>
      </button>

      <div className="flex flex-1 flex-col justify-between gap-4 p-5 xl:p-6">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="min-w-0 truncate font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              <span className="font-semibold text-primary">{`0${index + 1}`}</span>
              {project.client || project.category ? (
                <>
                  <span aria-hidden="true" className="mx-1.5 text-border-strong">
                    ·
                  </span>
                  <span>{project.client || project.category}</span>
                </>
              ) : null}
            </p>

            <div className="flex shrink-0 items-center gap-2">
              {project.year && (
                <span className="font-mono text-[11px] text-muted-foreground">
                  {project.year}
                </span>
              )}
              {screenCount > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-layer-2/80 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                  <Layers aria-hidden="true" className="h-3 w-3" />
                  <span>
                    {t("projects.screensCount").replace("{count}", String(screenCount))}
                  </span>
                </span>
              )}
            </div>
          </div>

          <h3 className="mt-2.5 text-heading-sm md:text-heading-md font-bold leading-snug tracking-tight text-foreground">
            {project.title}
          </h3>

          {project.metric && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-border/70 bg-layer-2/75 px-3 py-2 text-xs">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_var(--action-primary-background)]"
              />
              <span className="truncate font-mono text-foreground/90">
                {project.metric}
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2.5 border-t border-border/60 pt-4">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={onPreview}
            className="w-full justify-center gap-1.5 px-3 text-xs xl:text-sm"
          >
            <Eye aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span>{t("projects.quickView")}</span>
          </Button>

          <Button
            type="button"
            size="default"
            onClick={() => onSelect?.(project.slug.current)}
            className="group/case w-full justify-center gap-1.5 px-3 text-xs xl:text-sm"
          >
            <span>{t("projects.viewCase")}</span>
            <ArrowUpRight
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover/case:translate-x-0.5 group-hover/case:-translate-y-0.5"
            />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}

export const Projects = ({ onProjectClick }: { onProjectClick?: (id: string) => void }) => {
  const [activeTab, setActiveTab] = useState<"ui" | "study">("ui");
  const [quickViewIndex, setQuickViewIndex] = useState<number | null>(null);
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

  useEffect(() => {
    setQuickViewIndex(null);
  }, [currentTab]);

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
              className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 3 }).map((_, index) => (
                <li
                  key={index}
                  className="flex flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-layer-1/60 backdrop-blur-xl"
                >
                  <div className="aspect-[5/6] w-full bg-muted/40" />
                  <div className="flex flex-1 flex-col gap-4 p-5 xl:p-6">
                    <div className="flex items-center justify-between gap-2">
                      <div className="h-3 w-28 rounded-full bg-muted/50" />
                      <div className="h-5 w-20 rounded-full bg-muted/45" />
                    </div>
                    <div className="h-6 w-3/4 rounded-full bg-muted/60" />
                    <div className="h-8 w-full rounded-xl bg-muted/40" />
                    <div className="grid grid-cols-2 gap-2.5 border-t border-border/50 pt-4">
                      <div className="h-10 rounded-full bg-muted/45" />
                      <div className="h-10 rounded-full bg-muted/55" />
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
          <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <li key={project._id}>
                <ProjectGalleryCard
                  project={project}
                  index={index}
                  onPreview={() => setQuickViewIndex(index)}
                  onSelect={onProjectClick}
                />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <ProjectQuickViewModal
        projects={featuredProjects}
        activeProjectIndex={quickViewIndex}
        onClose={() => setQuickViewIndex(null)}
        onSelectProjectIndex={setQuickViewIndex}
        onOpenFullCase={(slug) => onProjectClick?.(slug)}
      />
    </div>
  );
};
