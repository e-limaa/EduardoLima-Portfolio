import { cn } from "@limia/design-system";
import { useCurrentDoc } from "../context";
import type { DocA11yStatus, DocKind, DocResources, DocStatus } from "../types";
import { DocsPageHero } from "./DocsPageHero";

interface DocsPageHeaderProps {
  title: string;
  description?: string;
  status?: DocStatus;
  kind?: DocKind;
  resources?: DocResources;
  a11yStatus?: DocA11yStatus;
  className?: string;
}

export function DocsPageHeader({
  title,
  description,
  status = "stable",
  kind = "component",
  resources,
  a11yStatus,
  className,
}: DocsPageHeaderProps) {
  const doc = useCurrentDoc();

  if (doc) return null;

  return (
    <DocsPageHero
      title={title}
      description={description}
      status={status}
      kind={kind}
      resources={resources}
      a11yStatus={a11yStatus}
      className={cn("mb-8", className)}
    />
  );
}
