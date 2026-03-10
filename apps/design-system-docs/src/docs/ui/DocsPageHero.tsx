import { Badge, cn } from "@limia/design-system";

import { useLanguage } from "../../components/language-provider";
import type { DocA11yStatus, DocKind, DocResources, DocStatus } from "../types";
import { DocStatusBadge } from "./DocStatusBadge";

const kindVariantMap: Record<DocKind, "outline" | "secondary" | "default"> = {
  "getting-started": "secondary",
  foundation: "outline",
  component: "default",
  pattern: "secondary",
  governance: "outline",
};

const a11yVariantMap: Record<
  DocA11yStatus,
  "outline" | "secondary" | "default"
> = {
  reviewed: "outline",
  partial: "secondary",
  "not-reviewed": "secondary",
};

function formatResourceList(resources?: DocResources) {
  if (!resources) return [];

  return [
    { label: "docs.resources.package", value: resources.package },
    { label: "docs.resources.import", value: resources.import },
    { label: "docs.resources.source", value: resources.source },
    { label: "docs.resources.storybook", value: resources.storybook },
    { label: "docs.resources.figma", value: resources.figma },
  ].filter((resource): resource is { label: string; value: string } =>
    Boolean(resource.value),
  );
}

interface DocsPageHeroProps {
  title: string;
  description?: string;
  status: DocStatus;
  kind: DocKind;
  a11yStatus?: DocA11yStatus;
  resources?: DocResources;
  className?: string;
}

export function DocsPageHero({
  title,
  description,
  status,
  kind,
  a11yStatus,
  resources,
  className,
}: DocsPageHeroProps) {
  const { t } = useLanguage();
  const resourceList = formatResourceList(resources).slice(0, 3);

  return (
    <header
      className={cn(
        "space-y-6 border-b border-border pb-8 lg:pb-10",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={kindVariantMap[kind]} className="font-mono text-[10px] uppercase tracking-[0.24em]">
          {t(`docs.kind.${kind}`)}
        </Badge>
        <DocStatusBadge status={status} />
        {a11yStatus && (
          <Badge
            variant={a11yVariantMap[a11yStatus]}
            className="font-mono text-[10px] uppercase tracking-[0.24em]"
          >
            {t(`docs.a11y.${a11yStatus}`)}
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground lg:text-xl">
            {description}
          </p>
        )}
      </div>

      {resourceList.length > 0 && (
        <div className="grid gap-3 md:grid-cols-3">
          {resourceList.map((resource) => (
            <div
              key={resource.label}
              className="rounded-xl border border-border bg-card/50 p-4"
            >
              <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                {t(resource.label)}
              </p>
              <p className="break-words font-mono text-xs text-foreground">
                {resource.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
