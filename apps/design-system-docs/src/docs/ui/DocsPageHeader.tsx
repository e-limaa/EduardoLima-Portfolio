import { cn } from "@limia/design-system";
import type { DocStatus } from "../types";
import { DocStatusBadge } from "./DocStatusBadge";

interface DocsPageHeaderProps {
  title: string;
  description?: string;
  status?: DocStatus;
  className?: string;
}

export function DocsPageHeader({
  title,
  description,
  status = "stable",
  className,
}: DocsPageHeaderProps) {
  return (
    <div className={cn("mb-8 space-y-4 border-b border-border pb-8", className)}>
      <div className="flex items-center gap-3">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {title}
        </h1>
        {status && <DocStatusBadge status={status} />}
      </div>
      {description && (
        <p className="max-w-3xl text-xl leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
