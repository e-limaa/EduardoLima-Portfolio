import { cn } from "@limia/design-system";

import { useLanguage } from "../../components/language-provider";
import type { DocChapter } from "../types";

interface DocsSectionNavProps {
  chapters: DocChapter[];
  availableIds?: string[];
  className?: string;
}

export function DocsSectionNav({
  chapters,
  availableIds = [],
  className,
}: DocsSectionNavProps) {
  const { t } = useLanguage();
  const availableSet = new Set(availableIds);

  const visibleChapters = chapters.filter(
    (chapter) => availableIds.length === 0 || availableSet.has(chapter.id),
  );

  if (visibleChapters.length === 0) return null;

  return (
    <section className={cn("space-y-3", className)}>
      <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {t("docs.rail.on-this-page")}
      </h2>
      <nav aria-label={t("docs.rail.on-this-page")}>
        <ol className="space-y-1.5">
          {visibleChapters.map((chapter) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {t(chapter.label)}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </section>
  );
}
