import { cn } from "@limia/design-system";
import { NavLink } from "react-router-dom";

import { useLanguage } from "../../components/language-provider";
import { docsRegistry } from "../registry";

interface DocsRelatedLinksProps {
  related?: string[];
  className?: string;
}

export function DocsRelatedLinks({
  related,
  className,
}: DocsRelatedLinksProps) {
  const { t } = useLanguage();

  const relatedDocs = docsRegistry.filter((doc) => related?.includes(doc.href));

  if (relatedDocs.length === 0) return null;

  return (
    <section className={cn("space-y-3", className)}>
      <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {t("docs.rail.related")}
      </h2>
      <div className="space-y-1.5">
        {relatedDocs.map((doc) => (
          <NavLink
            key={doc.href}
            to={doc.href}
            className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {t(doc.title)}
          </NavLink>
        ))}
      </div>
    </section>
  );
}
