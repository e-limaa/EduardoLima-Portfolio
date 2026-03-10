import React from "react";
import { Badge, cn } from "@limia/design-system";

import { useLanguage } from "../../components/language-provider";
import type { DocPage } from "../types";
import { DocStatusBadge } from "./DocStatusBadge";
import { DocsRelatedLinks } from "./DocsRelatedLinks";
import { DocsResources } from "./DocsResources";
import { DocsSectionNav } from "./DocsSectionNav";

interface DocsMetaRailProps {
  doc: DocPage;
  className?: string;
}

export function DocsMetaRail({ doc, className }: DocsMetaRailProps) {
  const { t } = useLanguage();
  const [availableIds, setAvailableIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    const collectHeadings = () => {
      const headings = Array.from(
        document.querySelectorAll("[data-doc-body] h2[id]"),
      ).map((heading) => heading.id);

      setAvailableIds(headings);
    };

    collectHeadings();

    const timeoutId = window.setTimeout(collectHeadings, 120);
    const observer = new MutationObserver(collectHeadings);
    const body = document.querySelector("[data-doc-body]");

    if (body) {
      observer.observe(body, { childList: true, subtree: true });
    }

    return () => {
      window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [doc.href]);

  return (
    <aside
      className={cn(
        "space-y-6 rounded-2xl border border-border bg-card/30 p-5 xl:sticky xl:top-8",
        className,
      )}
    >
      <section className="space-y-3">
        <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {t("docs.rail.metadata")}
        </h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-[0.2em]">
            {t(`docs.kind.${doc.kind}`)}
          </Badge>
          <DocStatusBadge status={doc.status} />
          {doc.a11yStatus && (
            <Badge
              variant={doc.a11yStatus === "reviewed" ? "outline" : "secondary"}
              className="font-mono text-[10px] uppercase tracking-[0.2em]"
            >
              {t(`docs.a11y.${doc.a11yStatus}`)}
            </Badge>
          )}
        </div>
      </section>

      <DocsSectionNav chapters={doc.chapters} availableIds={availableIds} />
      <DocsResources resources={doc.resources} />
      <DocsRelatedLinks related={doc.related} />
    </aside>
  );
}
