import { cn } from "@limia/design-system";

import { useLanguage } from "../../components/language-provider";
import type { DocResources } from "../types";

const resourceOrder: Array<keyof DocResources> = [
  "package",
  "import",
  "source",
  "storybook",
  "figma",
];

interface DocsResourcesProps {
  resources?: DocResources;
  className?: string;
}

export function DocsResources({ resources, className }: DocsResourcesProps) {
  const { t } = useLanguage();

  if (!resources) return null;

  const entries = resourceOrder
    .map((key) => ({
      key,
      value: resources[key],
    }))
    .filter((entry): entry is { key: keyof DocResources; value: string } =>
      Boolean(entry.value),
    );

  if (entries.length === 0) return null;

  return (
    <section className={cn("space-y-3", className)}>
      <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {t("docs.rail.resources")}
      </h2>
      <div className="space-y-2">
        {entries.map((entry) => (
          <div
            key={entry.key}
            className="rounded-xl border border-border bg-card/50 p-3"
          >
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {t(`docs.resources.${entry.key}`)}
            </p>
            <p className="break-words font-mono text-xs text-foreground">
              {entry.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
